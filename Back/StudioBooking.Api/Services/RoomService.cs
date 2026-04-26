using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.DTOs.Rooms;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Services;

public interface IRoomService
{
    Task<RoomDetailDto> GetByIdAsync(int id, DateOnly? date, CancellationToken ct);
    Task<RoomDto> CreateAsync(RoomCreateDto dto, CancellationToken ct);
    Task<RoomDto> UpdateAsync(int id, RoomUpdateDto dto, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
}

public class RoomService : IRoomService
{
    private readonly IRoomRepository _rooms;
    private readonly IStudioRepository _studios;
    private readonly ICurrentUser _currentUser;

    public RoomService(IRoomRepository rooms, IStudioRepository studios, ICurrentUser currentUser)
    {
        _rooms = rooms; _studios = studios; _currentUser = currentUser;
    }

    public async Task<RoomDetailDto> GetByIdAsync(int id, DateOnly? date, CancellationToken ct)
    {
        var room = await _rooms.FindByIdWithDetailsAsync(id, ct)
            ?? throw new NotFoundException($"Room {id} not found.");
        var busySlots = date.HasValue
            ? (await _rooms.GetBusySlotsAsync(id, date.Value, ct)).Select(b => new BusySlotDto(b.StartTime, b.EndTime))
            : Enumerable.Empty<BusySlotDto>();
        return ToDetailDto(room, busySlots);
    }

    public async Task<RoomDto> CreateAsync(RoomCreateDto dto, CancellationToken ct)
    {
        var studio = await _studios.FindByIdAsync(dto.StudioId, ct)
            ?? throw new NotFoundException($"Studio {dto.StudioId} not found.");
        EnsureOwnership(studio);
        var room = new Room
        {
            StudioId = dto.StudioId, Name = dto.Name, AreaSqm = dto.AreaSqm,
            PricePerHour = dto.PricePerHour, IsAvailable = true,
            Description = dto.Description, PhotoUrl = dto.PhotoUrl,
        };
        await _rooms.CreateAsync(room, ct);
        var created = await _rooms.FindByIdAsync(room.RoomId, ct)!;
        return ToDto(created!);
    }

    public async Task<RoomDto> UpdateAsync(int id, RoomUpdateDto dto, CancellationToken ct)
    {
        var room = await _rooms.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Room {id} not found.");
        EnsureOwnership(room.Studio);
        room.Name = dto.Name; room.AreaSqm = dto.AreaSqm; room.PricePerHour = dto.PricePerHour;
        room.IsAvailable = dto.IsAvailable; room.Description = dto.Description; room.PhotoUrl = dto.PhotoUrl;
        await _rooms.UpdateAsync(room, ct);
        return ToDto(room);
    }

    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var room = await _rooms.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Room {id} not found.");
        EnsureOwnership(room.Studio);
        await _rooms.DeleteAsync(room, ct);
    }

    private void EnsureOwnership(Studio studio)
    {
        if (_currentUser.Role == Roles.Superadmin) return;
        if (studio.AdminId != _currentUser.UserId) throw new ForbiddenException();
    }

    private static RoomDto ToDto(Room r) => new(
        r.RoomId, r.StudioId, r.Studio?.Name ?? "", r.Name,
        r.AreaSqm, r.PricePerHour, r.IsAvailable, r.Description, r.PhotoUrl);

    private static RoomDetailDto ToDetailDto(Room r, IEnumerable<BusySlotDto> busy) => new(
        r.RoomId, r.StudioId, r.Studio?.Name ?? "", r.Name,
        r.AreaSqm, r.PricePerHour, r.IsAvailable, r.Description, r.PhotoUrl,
        r.Equipments.Select(e => new EquipmentSummaryDto(e.EquipmentId, e.Name, e.EquipmentType?.Name ?? "", e.Condition, e.PricePerHour)),
        busy);
}
