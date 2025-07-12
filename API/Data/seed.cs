using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    // Ensure the class is public
    public class seed
    {

        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            try
            {
                var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

                if (users == null || !users.Any())
                {
                    throw new Exception("No users found in the seed data.");
                }

                foreach (var user in users)
                {
                    Console.WriteLine($"Seeding user: {user.UserName}");  // Debugging output

                    using var hmac = new HMACSHA512();
                    user.UserName = user.UserName.ToLower();
                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$wOrd"));
                    user.PasswordSalt = hmac.Key;

                    context.Users.Add(user);
                }

                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log any errors that occur during the seeding process
                Console.WriteLine($"An error occurred during user seeding: {ex.Message}");
            }
        }

    }
}
