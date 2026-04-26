using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Repositories;

public class RoomRepository : IRoomRepository
{
    private readonly ApplicationDbContext _db;
    public RoomRepository(ApplicationDbContext db) => _db = db;

    public Task<Room?> FindByIdAsync(int id, CancellationToken ct) =>
        _db.Rooms.Include(r => r.Studio).ThenInclude(s => s.Admin)
            .FirstOrDefaultAsync(r => r.RoomId == id, ct);

    public Task<Room?> FindByIdWithDetailsAsync(int id, CancellationToken ct) =>
        _db.Rooms
            .Include(r => r.Studio).ThenInclude(s => s.City)
            .Include(r => r.Equipments).ThenInclude(e => e.EquipmentType)
            .FirstOrDefaultAsync(r => r.RoomId == id, ct);

    public async Task<IEnumerable<Room>> GetByStudioAsync(int studioId, CancellationToken ct) =>
        await _db.Rooms.Where(r => r.StudioId == studioId).ToListAsync(ct);

    public async Task<Room> CreateAsync(Room room, CancellationToken ct)
    {
        _db.Rooms.Add(room);
        await _db.SaveChangesAsync(ct);
        return room;
    }

    public async Task UpdateAsync(Room room, CancellationToken ct)
    {
        _db.Rooms.Update(room);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Room room, CancellationToken ct)
    {
        _db.Rooms.Remove(room);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<IEnumerable<Booking>> GetBusySlotsAsync(int roomId, DateOnly date, CancellationToken ct) =>
        await _db.Bookings
            .Where(b => b.RoomId == roomId && b.Date == date
                && (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed))
            .ToListAsync(ct);
}
