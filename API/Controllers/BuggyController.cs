using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuggyController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public BuggyController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [Authorize]
        [HttpGet("Auth")]

        public ActionResult<String> GetSecret()
        {
            return "secret";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFount()
        {
            var thing = _dataContext.Users.Find(-1);
            if(thing == null)
            {
                return NotFound();
            }

            return thing;
        }

        [HttpGet("server-error")]
        public ActionResult<string> ServerError()
        {

            var thing = _dataContext.Users.Find(-1);
            var thingToReturn = thing.ToString();
            return thingToReturn; 
        }

        [HttpGet("bad-request")]

        public ActionResult<String> GetBadRequest()
        {
            return BadRequest("this was not a good request");
        }
    }
}
