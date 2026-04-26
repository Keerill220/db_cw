using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Exceptions;
using StudioBooking.Api.DTOs.Auth;
using StudioBooking.Api.DTOs.Common;
using StudioBooking.Api.Models.Entities;
using StudioBooking.Api.Repositories.Interfaces;

namespace StudioBooking.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginClientAsync(LoginRequest request, CancellationToken ct);
    Task<AuthResponse> LoginAdminAsync(LoginRequest request, CancellationToken ct);
    Task<AuthResponse> RegisterClientAsync(RegisterRequest request, CancellationToken ct);
    Task<MeResponse> GetMeAsync(CancellationToken ct);
    Task<ProfileUpdateDto> UpdateProfileAsync(ProfileUpdateDto dto, CancellationToken ct);
    Task ChangePasswordAsync(ChangePasswordDto dto, CancellationToken ct);
}

public class AuthService : IAuthService
{
    private readonly IClientRepository _clients;
    private readonly IAdministratorRepository _admins;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenService _jwt;
    private readonly ICurrentUser _currentUser;

    public AuthService(
        IClientRepository clients, IAdministratorRepository admins,
        IPasswordHasher hasher, IJwtTokenService jwt, ICurrentUser currentUser)
    {
        _clients = clients; _admins = admins;
        _hasher = hasher; _jwt = jwt; _currentUser = currentUser;
    }

    public async Task<AuthResponse> LoginClientAsync(LoginRequest request, CancellationToken ct)
    {
        var client = await _clients.FindByEmailAsync(request.Email, ct)
            ?? throw new NotFoundException("Client not found.");
        if (!_hasher.Verify(request.Password, client.PasswordHash))
            throw new ValidationException("password", "Invalid password.");

        var token = _jwt.GenerateToken(client.ClientId, client.Email, Roles.Client, "client");
        return new AuthResponse(token, Roles.Client, client.ClientId, "client", DateTime.UtcNow.AddDays(1));
    }

    public async Task<AuthResponse> LoginAdminAsync(LoginRequest request, CancellationToken ct)
    {
        var admin = await _admins.FindByEmailAsync(request.Email, ct)
            ?? throw new NotFoundException("Administrator not found.");
        if (!_hasher.Verify(request.Password, admin.PasswordHash))
            throw new ValidationException("password", "Invalid password.");

        var role = admin.Role == AdminRole.Superadmin ? Roles.Superadmin : Roles.Owner;
        var token = _jwt.GenerateToken(admin.AdminId, admin.Email, role, "admin");
        return new AuthResponse(token, role, admin.AdminId, "admin", DateTime.UtcNow.AddDays(1));
    }

    public async Task<AuthResponse> RegisterClientAsync(RegisterRequest request, CancellationToken ct)
    {
        if (await _clients.FindByEmailAsync(request.Email, ct) != null)
            throw new ConflictException("Email already registered.");

        var client = new Client
        {
            Email = request.Email,
            PasswordHash = _hasher.Hash(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await _clients.CreateAsync(client, ct);
        var token = _jwt.GenerateToken(client.ClientId, client.Email, Roles.Client, "client");
        return new AuthResponse(token, Roles.Client, client.ClientId, "client", DateTime.UtcNow.AddDays(1));
    }

    public async Task<MeResponse> GetMeAsync(CancellationToken ct)
    {
        if (_currentUser.IsClient)
        {
            var c = await _clients.FindByIdAsync(_currentUser.UserId, ct)
                ?? throw new NotFoundException("Client not found.");
            return new MeResponse(c.ClientId, c.Email, c.FirstName, c.LastName, c.Phone, Roles.Client, "client");
        }
        var a = await _admins.FindByIdAsync(_currentUser.UserId, ct)
            ?? throw new NotFoundException("Administrator not found.");
        var role = a.Role == AdminRole.Superadmin ? Roles.Superadmin : Roles.Owner;
        return new MeResponse(a.AdminId, a.Email, a.FirstName, a.LastName, a.Phone, role, "admin");
    }

    public async Task<ProfileUpdateDto> UpdateProfileAsync(ProfileUpdateDto dto, CancellationToken ct)
    {
        if (_currentUser.IsClient)
        {
            var c = await _clients.FindByIdAsync(_currentUser.UserId, ct)
                ?? throw new NotFoundException("Client not found.");
            c.FirstName = dto.FirstName; c.LastName = dto.LastName; c.Phone = dto.Phone;
            await _clients.UpdateAsync(c, ct);
        }
        else
        {
            var a = await _admins.FindByIdAsync(_currentUser.UserId, ct)
                ?? throw new NotFoundException("Administrator not found.");
            a.FirstName = dto.FirstName; a.LastName = dto.LastName; a.Phone = dto.Phone;
            await _admins.UpdateAsync(a, ct);
        }
        return dto;
    }

    public async Task ChangePasswordAsync(ChangePasswordDto dto, CancellationToken ct)
    {
        if (_currentUser.IsClient)
        {
            var c = await _clients.FindByIdAsync(_currentUser.UserId, ct)
                ?? throw new NotFoundException("Client not found.");
            if (!_hasher.Verify(dto.CurrentPassword, c.PasswordHash))
                throw new ValidationException("currentPassword", "Wrong current password.");
            c.PasswordHash = _hasher.Hash(dto.NewPassword);
            await _clients.UpdateAsync(c, ct);
        }
        else
        {
            var a = await _admins.FindByIdAsync(_currentUser.UserId, ct)
                ?? throw new NotFoundException("Administrator not found.");
            if (!_hasher.Verify(dto.CurrentPassword, a.PasswordHash))
                throw new ValidationException("currentPassword", "Wrong current password.");
            a.PasswordHash = _hasher.Hash(dto.NewPassword);
            await _admins.UpdateAsync(a, ct);
        }
    }
}
