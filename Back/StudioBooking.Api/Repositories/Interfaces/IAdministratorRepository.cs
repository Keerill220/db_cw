using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Repositories.Interfaces;

public interface IAdministratorRepository
{
    Task<Administrator?> FindByEmailAsync(string email, CancellationToken ct = default);
    Task<Administrator?> FindByIdAsync(int id, CancellationToken ct = default);
    Task<(IEnumerable<Administrator> Items, int Total)> GetPagedAsync(int page, int pageSize, CancellationToken ct = default);
    Task<Administrator> CreateAsync(Administrator admin, CancellationToken ct = default);
    Task UpdateAsync(Administrator admin, CancellationToken ct = default);
}
