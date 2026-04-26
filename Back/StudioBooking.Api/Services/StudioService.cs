using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.Common.Pagination;
using StudioBooking.Api.DTOs.Studios;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Services;

public interface IStudioService
{
    Task<PagedResult<StudioDto>> GetPagedAsync(int page, int pageSize, int? cityId, decimal? minPrice, decimal? maxPrice, string? q, CancellationToken ct);
    Task<StudioDetailDto> GetByIdAsync(int id, CancellationToken ct);
    Task<StudioDto> CreateAsync(StudioCreateDto dto, CancellationToken ct);
    Task<StudioDto> UpdateAsync(int id, StudioUpdateDto dto, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
}

public class StudioService : IStudioService
{
    private readonly IStudioRepository _studios;
    private readonly ICurrentUser _currentUser;

    public StudioService(IStudioRepository studios, ICurrentUser currentUser)
    {
        _studios = studios; _currentUser = currentUser;
    }

    public async Task<PagedResult<StudioDto>> GetPagedAsync(int page, int pageSize, int? cityId, decimal? minPrice, decimal? maxPrice, string? q, CancellationToken ct)
    {
        var (items, total) = await _studios.GetPagedAsync(page, pageSize, cityId, minPrice, maxPrice, q, ct);
        return PagedResult<StudioDto>.From(items.Select(ToDto), total, page, pageSize);
    }

    public async Task<StudioDetailDto> GetByIdAsync(int id, CancellationToken ct)
    {
        var studio = await _studios.FindByIdWithRoomsAsync(id, ct)
            ?? throw new NotFoundException($"Studio {id} not found.");
        return ToDetailDto(studio);
    }

    public async Task<StudioDto> CreateAsync(StudioCreateDto dto, CancellationToken ct)
    {
        var studio = new Studio
        {
            AdminId = _currentUser.UserId,
            CityId = dto.CityId,
            Name = dto.Name,
            Address = dto.Address,
            Description = dto.Description,
            PhotoUrl = dto.PhotoUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await _studios.CreateAsync(studio, ct);
        var created = await _studios.FindByIdAsync(studio.StudioId, ct)!;
        return ToDto(created!);
    }

    public async Task<StudioDto> UpdateAsync(int id, StudioUpdateDto dto, CancellationToken ct)
    {
        var studio = await _studios.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Studio {id} not found.");
        EnsureOwnership(studio);
        studio.Name = dto.Name; studio.CityId = dto.CityId; studio.Address = dto.Address;
        studio.Description = dto.Description; studio.PhotoUrl = dto.PhotoUrl; studio.IsActive = dto.IsActive;
        await _studios.UpdateAsync(studio, ct);
        var updated = await _studios.FindByIdAsync(id, ct)!;
        return ToDto(updated!);
    }

    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var studio = await _studios.FindByIdAsync(id, ct)
            ?? throw new NotFoundException($"Studio {id} not found.");
        EnsureOwnership(studio);
        await _studios.DeleteAsync(studio, ct);
    }

    private void EnsureOwnership(Studio studio)
    {
        if (_currentUser.Role == Roles.Superadmin) return;
        if (studio.AdminId != _currentUser.UserId) throw new ForbiddenException();
    }

    private static StudioDto ToDto(Studio s) => new(
        s.StudioId, s.Name, s.City?.Name ?? "", s.City?.Country ?? "",
        s.Address, s.Description, s.PhotoUrl, s.IsActive, s.AdminId, s.CreatedAt);

    private static StudioDetailDto ToDetailDto(Studio s) => new(
        s.StudioId, s.Name, s.City?.Name ?? "", s.City?.Country ?? "",
        s.Address, s.Description, s.PhotoUrl, s.IsActive, s.AdminId, s.CreatedAt,
        s.Rooms.Select(r => new RoomSummaryDto(r.RoomId, r.Name, r.AreaSqm, r.PricePerHour, r.IsAvailable, r.PhotoUrl)));
}
