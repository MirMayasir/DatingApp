﻿namespace API.Errors
{
    public class ApiExceptions
    {
        public ApiExceptions( int statusCode, string message, string details)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }

        public string Details   { get; set; }

    }
}
