using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Pagination;
using StudioBooking.Api.DTOs.Common;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Superadmin)]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    public AdminController(IAdminService adminService) => _adminService = adminService;

    [HttpGet("administrators")]
    public Task<PagedResult<AdminUserDto>> GetAdministrators(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        CancellationToken ct = default) =>
        _adminService.GetAdministratorsAsync(page, pageSize, ct);

    [HttpPost("administrators")]
    public Task<AdminUserDto> CreateAdministrator([FromBody] AdminCreateDto dto, CancellationToken ct) =>
        _adminService.CreateAdministratorAsync(dto, ct);
}
