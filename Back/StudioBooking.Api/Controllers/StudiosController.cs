using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Pagination;
using StudioBooking.Api.DTOs.Studios;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/studios")]
public class StudiosController : ControllerBase
{
    private readonly IStudioService _studios;
    public StudiosController(IStudioService studios) => _studios = studios;

    [HttpGet]
    public Task<PagedResult<StudioDto>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] int? cityId = null, [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null, [FromQuery] string? q = null,
        CancellationToken ct = default) =>
        _studios.GetPagedAsync(page, pageSize, cityId, minPrice, maxPrice, q, ct);

    [HttpGet("{id:int}")]
    public Task<StudioDetailDto> GetById(int id, CancellationToken ct) =>
        _studios.GetByIdAsync(id, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPost]
    public Task<StudioDto> Create([FromBody] StudioCreateDto dto, CancellationToken ct) =>
        _studios.CreateAsync(dto, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPut("{id:int}")]
    public Task<StudioDto> Update(int id, [FromBody] StudioUpdateDto dto, CancellationToken ct) =>
        _studios.UpdateAsync(id, dto, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _studios.DeleteAsync(id, ct);
        return NoContent();
    }
}
