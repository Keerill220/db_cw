using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly ApplicationDbContext _db;
    public BookingRepository(ApplicationDbContext db) => _db = db;

    public Task<Booking?> FindByIdAsync(int id, CancellationToken ct) =>
        _db.Bookings
            .Include(b => b.Room).ThenInclude(r => r.Studio)
            .Include(b => b.Client)
            .FirstOrDefaultAsync(b => b.BookingId == id, ct);

    public Task<Booking?> FindByIdWithDetailsAsync(int id, CancellationToken ct) =>
        _db.Bookings
            .Include(b => b.Room).ThenInclude(r => r.Studio)
            .Include(b => b.Client)
            .Include(b => b.BookingEquipments).ThenInclude(be => be.Equipment)
            .FirstOrDefaultAsync(b => b.BookingId == id, ct);

    public async Task<(IEnumerable<Booking> Items, int Total)> GetPagedAsync(
        int page, int pageSize,
        int? clientId, int? roomId, int? studioId,
        DateOnly? from, DateOnly? to, string? status, CancellationToken ct)
    {
        var q = _db.Bookings
            .Include(b => b.Room).ThenInclude(r => r.Studio)
            .Include(b => b.Client)
            .AsQueryable();

        if (clientId.HasValue) q = q.Where(b => b.ClientId == clientId.Value);
        if (roomId.HasValue) q = q.Where(b => b.RoomId == roomId.Value);
        if (studioId.HasValue) q = q.Where(b => b.Room.StudioId == studioId.Value);
        if (from.HasValue) q = q.Where(b => b.Date >= from.Value);
        if (to.HasValue) q = q.Where(b => b.Date <= to.Value);
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<BookingStatus>(status, true, out var s))
            q = q.Where(b => b.Status == s);

        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(b => b.Date).ThenByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task<Booking> CreateAsync(Booking booking, CancellationToken ct)
    {
        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync(ct);
        return booking;
    }

    public async Task UpdateAsync(Booking booking, CancellationToken ct)
    {
        _db.Bookings.Update(booking);
        await _db.SaveChangesAsync(ct);
    }

    public async Task AddEquipmentAsync(BookingEquipment be, CancellationToken ct)
    {
        _db.BookingEquipments.Add(be);
        await _db.SaveChangesAsync(ct);
    }
}
