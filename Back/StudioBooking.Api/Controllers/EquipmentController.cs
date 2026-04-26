using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.Auth;
using StudioBooking.Api.DTOs.Equipment;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/equipment")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipment;
    public EquipmentController(IEquipmentService equipment) => _equipment = equipment;

    [HttpGet("{id:int}")]
    public Task<EquipmentDto> GetById(int id, CancellationToken ct) =>
        _equipment.GetByIdAsync(id, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPost]
    public Task<EquipmentDto> Create([FromBody] EquipmentCreateDto dto, CancellationToken ct) =>
        _equipment.CreateAsync(dto, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPut("{id:int}")]
    public Task<EquipmentDto> Update(int id, [FromBody] EquipmentUpdateDto dto, CancellationToken ct) =>
        _equipment.UpdateAsync(id, dto, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _equipment.DeleteAsync(id, ct);
        return NoContent();
    }
}
