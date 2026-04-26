using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Repositories.Interfaces;

public interface IClientRepository
{
    Task<Client?> FindByEmailAsync(string email, CancellationToken ct = default);
    Task<Client?> FindByIdAsync(int id, CancellationToken ct = default);
    Task<Client> CreateAsync(Client client, CancellationToken ct = default);
    Task UpdateAsync(Client client, CancellationToken ct = default);
}
