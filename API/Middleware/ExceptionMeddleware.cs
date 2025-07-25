﻿using API.Errors;
using Microsoft.VisualBasic;
using System.Net;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMeddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMeddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMeddleware(RequestDelegate next, ILogger<ExceptionMeddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)(HttpStatusCode.InternalServerError);

                var response = _env.IsDevelopment()
                    ? new ApiExceptions(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new ApiExceptions(context.Response.StatusCode, ex.Message, "Internal server error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
