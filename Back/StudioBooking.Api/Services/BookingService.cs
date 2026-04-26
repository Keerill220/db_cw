using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.Common.Pagination;
using StudioBooking.Api.Data;
using StudioBooking.Api.DTOs.Bookings;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Services;

public interface IBookingService
{
    Task<PagedResult<BookingDto>> GetPagedAsync(int page, int pageSize, int? clientId, int? roomId, int? studioId, DateOnly? from, DateOnly? to, string? status, CancellationToken ct);
    Task<BookingDto> GetByIdAsync(int id, CancellationToken ct);
    Task<BookingDto> CreateAsync(BookingCreateDto dto, CancellationToken ct);
    Task<BookingDto> CancelAsync(int id, CancellationToken ct);
    Task<BookingDto> ConfirmAsync(int id, CancellationToken ct);
}

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookings;
    private readonly IRoomRepository _rooms;
    private readonly IEquipmentRepository _equipment;
    private readonly ICurrentUser _currentUser;
    private readonly ApplicationDbContext _db;

    public BookingService(
        IBookingRepository bookings, IRoomRepository rooms,
        IEquipmentRepository equipment, ICurrentUser currentUser,
        ApplicationDbContext db)
    {
        _bookings = bookings; _rooms = rooms; _equipment = equipment;
        _currentUser = currentUser; _db = db;
    }

    public async Task<PagedResult<BookingDto>> GetPagedAsync(
        int page, int pageSize, int? clientId, int? roomId, int? studioId,
        DateOnly? from, DateOnly? to, string? status, CancellationToken ct)
    {
        var (items, total) = await _bookings.GetPagedAsync(page, pageSize, clientId, roomId, studioId, from, to, status, ct);
        return PagedResult<BookingDto>.From(items.Select(ToDto), total, page, pageSize);
    }

    public async Task<BookingDto> GetByIdAsync(int id, CancellationToken ct)
    {
        var b = await _bookings.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Booking {id} not found.");
        EnsureReadAccess(b);
        return ToDto(b);
    }

    public async Task<BookingDto> CreateAsync(BookingCreateDto dto, CancellationToken ct)
    {
        if (!_currentUser.IsClient) throw new ForbiddenException("Only clients can create bookings.");
        if (dto.EndTime <= dto.StartTime) throw new ValidationException("endTime", "End time must be after start time.");
        if (dto.Date < DateOnly.FromDateTime(DateTime.UtcNow)) throw new ValidationException("date", "Cannot book in the past.");

        var room = await _rooms.FindByIdAsync(dto.RoomId, ct)
            ?? throw new NotFoundException($"Room {dto.RoomId} not found.");
        if (!room.IsAvailable) throw new ConflictException("Room is not available.");

        // Collect equipment and calculate total price server-side
        var selectedEquipment = new List<Equipment>();
        if (dto.EquipmentIds?.Any() == true)
        {
            foreach (var eqId in dto.EquipmentIds.Distinct())
            {
                var eq = await _equipment.FindByIdAsync(eqId, ct)
                    ?? throw new NotFoundException($"Equipment {eqId} not found.");
                if (eq.RoomId != dto.RoomId) throw new ValidationException("equipmentIds", $"Equipment {eqId} does not belong to room {dto.RoomId}.");
                selectedEquipment.Add(eq);
            }
        }

        var durationHrs = (decimal)(dto.EndTime - dto.StartTime).TotalHours;
        var equipTotal = selectedEquipment.Sum(e => e.PricePerHour);
        var totalPrice = Math.Round((room.PricePerHour + equipTotal) * durationHrs, 2);

        await using var tx = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            var booking = new Booking
            {
                ClientId = _currentUser.UserId,
                RoomId = dto.RoomId,
                Date = dto.Date,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                TotalPrice = totalPrice,
                Status = BookingStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                Note = dto.Note,
            };
            await _bookings.CreateAsync(booking, ct);

            foreach (var eq in selectedEquipment)
            {
                await _bookings.AddEquipmentAsync(new BookingEquipment
                {
                    BookingId = booking.BookingId,
                    EquipmentId = eq.EquipmentId,
                    PriceSnapshot = eq.PricePerHour,
                }, ct);
            }

            await tx.CommitAsync(ct);
            var created = await _bookings.FindByIdAsync(booking.BookingId, ct)!;
            return ToDto(created!);
        }
        catch
        {
            await tx.RollbackAsync(ct);
            throw;
        }
    }

    public async Task<BookingDto> CancelAsync(int id, CancellationToken ct)
    {
        var b = await _bookings.FindByIdAsync(id, ct) ?? throw new NotFoundException($"Booking {id} not found.");
        if (_currentUser.IsClient && b.ClientId != _currentUser.UserId) throw new ForbiddenException();
        if (_currentUser.Role == Roles.Owner)
        {
            // Owner can cancel bookings for their own rooms only
            if (b.Room.Studio.AdminId != _currentUser.UserId) throw new ForbiddenException();
        }
        if (b.Status == BookingStatus.Cancelled) throw new ConflictException("Booking is already cancelled.");
        if (b.Status == BookingStatus.Completed) throw new ConflictException("Cannot cancel a completed booking.");
        b.Status = BookingStatus.Cancelled;
        await _bookings.UpdateAsync(b, ct);
        return ToDto(b);
    }

    public async Task<BookingDto> ConfirmAsync(int id, CancellationToken ct)
    {
        var b = await _bookings.FindByIdAsync(id, ct) ?? throw new NotFoundException($"Booking {id} not found.");
        if (_currentUser.Role == Roles.Owner && b.Room.Studio.AdminId != _currentUser.UserId)
            throw new ForbiddenException();
        if (b.Status != BookingStatus.Pending) throw new ConflictException("Only pending bookings can be confirmed.");
        b.Status = BookingStatus.Confirmed;
        await _bookings.UpdateAsync(b, ct);
        return ToDto(b);
    }

    private void EnsureReadAccess(Booking b)
    {
        if (_currentUser.Role == Roles.Superadmin) return;
        if (_currentUser.IsClient && b.ClientId == _currentUser.UserId) return;
        if (_currentUser.Role == Roles.Owner && b.Room.Studio.AdminId == _currentUser.UserId) return;
        throw new ForbiddenException();
    }

    private static BookingDto ToDto(Booking b) => new(
        b.BookingId, b.ClientId, $"{b.Client?.FirstName} {b.Client?.LastName}",
        b.RoomId, b.Room?.Name ?? "", b.Room?.Studio?.Name ?? "",
        b.Date, b.StartTime, b.EndTime, b.TotalPrice,
        b.Status.ToString(), b.CreatedAt, b.Note);
}
