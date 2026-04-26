using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Common.Pagination;
using StudioBooking.Api.DTOs.Bookings;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookings;
    private readonly ICurrentUser _currentUser;

    public BookingsController(IBookingService bookings, ICurrentUser currentUser)
    {
        _bookings = bookings; _currentUser = currentUser;
    }

    // Clients: own bookings. Owner/superadmin: filtered by their scope.
    [HttpGet]
    public Task<PagedResult<BookingDto>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] int? roomId = null, [FromQuery] int? studioId = null,
        [FromQuery] DateOnly? from = null, [FromQuery] DateOnly? to = null,
        [FromQuery] string? status = null, CancellationToken ct = default)
    {
        // Clients always see only their own bookings
        int? clientId = _currentUser.IsClient ? _currentUser.UserId : null;
        return _bookings.GetPagedAsync(page, pageSize, clientId, roomId, studioId, from, to, status, ct);
    }

    [HttpGet("{id:int}")]
    public Task<BookingDto> GetById(int id, CancellationToken ct) =>
        _bookings.GetByIdAsync(id, ct);

    [Authorize(Roles = Roles.Client)]
    [HttpPost]
    public Task<BookingDto> Create([FromBody] BookingCreateDto dto, CancellationToken ct) =>
        _bookings.CreateAsync(dto, ct);

    [HttpPatch("{id:int}/cancel")]
    public Task<BookingDto> Cancel(int id, CancellationToken ct) =>
        _bookings.CancelAsync(id, ct);

    [Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
    [HttpPatch("{id:int}/confirm")]
    public Task<BookingDto> Confirm(int id, CancellationToken ct) =>
        _bookings.ConfirmAsync(id, ct);
}
