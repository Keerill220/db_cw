using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.Auth;
using StudioBooking.Api.DTOs.Rooms;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _rooms;
    public RoomsController(IRoomService rooms) => _rooms = rooms;

    [HttpGet("{id:int}")]
    public Task<RoomDetailDto> GetById(int id, [FromQuery] DateOnly? date, CancellationToken ct) =>
        _rooms.GetByIdAsync(id, date, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPost]
    public Task<RoomDto> Create([FromBody] RoomCreateDto dto, CancellationToken ct) =>
        _rooms.CreateAsync(dto, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPut("{id:int}")]
    public Task<RoomDto> Update(int id, [FromBody] RoomUpdateDto dto, CancellationToken ct) =>
        _rooms.UpdateAsync(id, dto, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _rooms.DeleteAsync(id, ct);
        return NoContent();
    }
}
