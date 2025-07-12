using System.Security.Claims;

namespace API.Extentions
{
    public static class ClamesPrincipleExtenton
    {
        public static string GetUerName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static string GetUerId(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }


    }
}
