using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.Common.Pagination;
using StudioBooking.Api.Data;
using StudioBooking.Api.DTOs.Common;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Services;

public interface IAdminService
{
    Task<PagedResult<AdminUserDto>> GetAdministratorsAsync(int page, int pageSize, CancellationToken ct);
    Task<AdminUserDto> CreateAdministratorAsync(AdminCreateDto dto, CancellationToken ct);
}

public class AdminService : IAdminService
{
    private readonly IAdministratorRepository _admins;
    private readonly IPasswordHasher _hasher;

    public AdminService(IAdministratorRepository admins, IPasswordHasher hasher)
    {
        _admins = admins; _hasher = hasher;
    }

    public async Task<PagedResult<AdminUserDto>> GetAdministratorsAsync(int page, int pageSize, CancellationToken ct)
    {
        var (items, total) = await _admins.GetPagedAsync(page, pageSize, ct);
        return PagedResult<AdminUserDto>.From(items.Select(ToDto), total, page, pageSize);
    }

    public async Task<AdminUserDto> CreateAdministratorAsync(AdminCreateDto dto, CancellationToken ct)
    {
        if (await _admins.FindByEmailAsync(dto.Email, ct) != null)
            throw new ConflictException("Email already in use.");

        if (!Enum.TryParse<AdminRole>(dto.Role, true, out var role))
            throw new ValidationException("role", $"Invalid role '{dto.Role}'. Must be 'owner' or 'superadmin'.");

        var admin = new Administrator
        {
            Email = dto.Email,
            PasswordHash = _hasher.Hash(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Role = role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await _admins.CreateAsync(admin, ct);
        return ToDto(admin);
    }

    private static AdminUserDto ToDto(Administrator a) => new(
        a.AdminId, a.Email, a.FirstName, a.LastName, a.Phone,
        a.Role.ToString().ToLower(), a.CreatedAt);
}
