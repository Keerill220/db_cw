using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.Auth;
using StudioBooking.Api.DTOs.Common;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Roles = $"{Roles.Owner},{Roles.Superadmin}")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reports;
    public ReportsController(IReportService reports) => _reports = reports;

    [HttpGet("occupancy")]
    public Task<IEnumerable<OccupancyReportItemDto>> Occupancy(CancellationToken ct) =>
        _reports.GetOccupancyAsync(ct);

    [HttpGet("revenue")]
    public Task<IEnumerable<RevenueReportItemDto>> Revenue(CancellationToken ct) =>
        _reports.GetRevenueAsync(ct);

    [HttpGet("top-rooms")]
    public Task<IEnumerable<TopRoomDto>> TopRooms(CancellationToken ct) =>
        _reports.GetTopRoomsAsync(ct);
}
