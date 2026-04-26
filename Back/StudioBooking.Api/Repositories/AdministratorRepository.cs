using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Repositories;

public class AdministratorRepository : IAdministratorRepository
{
    private readonly ApplicationDbContext _db;
    public AdministratorRepository(ApplicationDbContext db) => _db = db;

    public Task<Administrator?> FindByEmailAsync(string email, CancellationToken ct) =>
        _db.Administrators.FirstOrDefaultAsync(a => a.Email == email, ct);

    public Task<Administrator?> FindByIdAsync(int id, CancellationToken ct) =>
        _db.Administrators.FindAsync([id], ct).AsTask();

    public async Task<(IEnumerable<Administrator> Items, int Total)> GetPagedAsync(int page, int pageSize, CancellationToken ct)
    {
        var q = _db.Administrators.OrderBy(a => a.AdminId);
        var total = await q.CountAsync(ct);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task<Administrator> CreateAsync(Administrator admin, CancellationToken ct)
    {
        _db.Administrators.Add(admin);
        await _db.SaveChangesAsync(ct);
        return admin;
    }

    public async Task UpdateAsync(Administrator admin, CancellationToken ct)
    {
        _db.Administrators.Update(admin);
        await _db.SaveChangesAsync(ct);
    }
}
