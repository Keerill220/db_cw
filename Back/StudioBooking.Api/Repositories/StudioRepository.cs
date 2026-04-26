using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Repositories;

public class StudioRepository : IStudioRepository
{
    private readonly ApplicationDbContext _db;
    public StudioRepository(ApplicationDbContext db) => _db = db;

    public async Task<(IEnumerable<Studio> Items, int Total)> GetPagedAsync(
        int page, int pageSize,
        int? cityId, decimal? minPrice, decimal? maxPrice, string? query, CancellationToken ct)
    {
        var q = _db.Studios.Include(s => s.City).Include(s => s.Rooms).AsQueryable();
        if (cityId.HasValue) q = q.Where(s => s.CityId == cityId.Value);
        if (!string.IsNullOrWhiteSpace(query)) q = q.Where(s => s.Name.Contains(query));
        if (minPrice.HasValue) q = q.Where(s => s.Rooms.Any(r => r.PricePerHour >= minPrice.Value));
        if (maxPrice.HasValue) q = q.Where(s => s.Rooms.Any(r => r.PricePerHour <= maxPrice.Value));
        q = q.Where(s => s.IsActive);
        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(s => s.StudioId).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public Task<Studio?> FindByIdAsync(int id, CancellationToken ct) =>
        _db.Studios.Include(s => s.City).FirstOrDefaultAsync(s => s.StudioId == id, ct);

    public Task<Studio?> FindByIdWithRoomsAsync(int id, CancellationToken ct) =>
        _db.Studios.Include(s => s.City).Include(s => s.Rooms)
            .FirstOrDefaultAsync(s => s.StudioId == id, ct);

    public async Task<IEnumerable<Studio>> GetByAdminAsync(int adminId, CancellationToken ct) =>
        await _db.Studios.Include(s => s.City).Where(s => s.AdminId == adminId).ToListAsync(ct);

    public async Task<Studio> CreateAsync(Studio studio, CancellationToken ct)
    {
        _db.Studios.Add(studio);
        await _db.SaveChangesAsync(ct);
        return studio;
    }

    public async Task UpdateAsync(Studio studio, CancellationToken ct)
    {
        _db.Studios.Update(studio);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Studio studio, CancellationToken ct)
    {
        _db.Studios.Remove(studio);
        await _db.SaveChangesAsync(ct);
    }
}
