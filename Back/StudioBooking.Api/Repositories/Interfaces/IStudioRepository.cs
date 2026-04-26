using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Repositories.Interfaces;

public interface IStudioRepository
{
    Task<(IEnumerable<Studio> Items, int Total)> GetPagedAsync(
        int page, int pageSize,
        int? cityId = null, decimal? minPrice = null, decimal? maxPrice = null,
        string? query = null, CancellationToken ct = default);

    Task<Studio?> FindByIdAsync(int id, CancellationToken ct = default);
    Task<Studio?> FindByIdWithRoomsAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Studio>> GetByAdminAsync(int adminId, CancellationToken ct = default);
    Task<Studio> CreateAsync(Studio studio, CancellationToken ct = default);
    Task UpdateAsync(Studio studio, CancellationToken ct = default);
    Task DeleteAsync(Studio studio, CancellationToken ct = default);
}
