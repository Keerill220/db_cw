using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly ApplicationDbContext _db;
    public ClientRepository(ApplicationDbContext db) => _db = db;

    public Task<Client?> FindByEmailAsync(string email, CancellationToken ct) =>
        _db.Clients.FirstOrDefaultAsync(c => c.Email == email, ct);

    public Task<Client?> FindByIdAsync(int id, CancellationToken ct) =>
        _db.Clients.FindAsync([id], ct).AsTask();

    public async Task<Client> CreateAsync(Client client, CancellationToken ct)
    {
        _db.Clients.Add(client);
        await _db.SaveChangesAsync(ct);
        return client;
    }

    public async Task UpdateAsync(Client client, CancellationToken ct)
    {
        _db.Clients.Update(client);
        await _db.SaveChangesAsync(ct);
    }
}
