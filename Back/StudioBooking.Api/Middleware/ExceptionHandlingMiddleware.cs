using System.Text.Json;
using StudioBooking.Api.Common.Exceptions;
using AppValidationException = StudioBooking.Api.Common.Exceptions.ValidationException;

namespace StudioBooking.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await WriteProblemAsync(context, ex);
        }
    }

    private static async Task WriteProblemAsync(HttpContext context, Exception ex)
    {
        var (status, title, errors) = ex switch
        {
            NotFoundException => (404, "Not Found", (object?)null),
            ConflictException => (409, "Conflict", (object?)null),
            ForbiddenException => (403, "Forbidden", (object?)null),
            AppValidationException ve => (422, "Validation Error", ve.Errors),
            _ => (500, "Internal Server Error", (object?)null),
        };

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = status;

        var problem = new Dictionary<string, object?>
        {
            ["type"] = $"https://httpstatuses.io/{status}",
            ["title"] = title,
            ["status"] = status,
            ["detail"] = ex.Message,
            ["errors"] = errors,
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(problem,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
