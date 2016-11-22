using Fjordens_Service_ver2.DAL.Contracts;
using Fjordens_Service_ver2.DAL.Repositories;
using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fjordens_Service_ver2.Controllers
{
    public class PostItController : Controller
    {
        public JsonResult GetPostIts()
        {
            List<PostItHelpModel> postItHelpModels = new List<PostItHelpModel>();
            using (IPostItRepository _postItRepository = new PostItRepository(ApplicationDbContext.Create()))
            using (ICustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
            using(IEmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                var postIts = _postItRepository.All();
                
                foreach (var postIt in postIts)
                {
                    var postItHelpModel = new PostItHelpModel()
                    {
                        id = postIt.EventId,
                        title = postIt.Title,
                        start = string.Format(postIt.From, "s"),
                        end = string.Format(postIt.To, "s"),
                        note = postIt.Note,
                        customer = _customerRepository.Find(postIt.CustomerId).Company,
                        employee = _employeeRepository.Find(postIt.EmployeeId).FirstName,
                        allDay = false
                    };
                    postItHelpModels.Add(postItHelpModel);
                }
            }
            var rows = postItHelpModels.ToArray();
            return Json(rows, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreatePostIt(PostItHelpModel postItHelpModel)
        {
            if (ModelState.IsValid)
            {
                using (PostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
                using (CustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
                using (EmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    var customerId = _customerRepository.FindByName(postItHelpModel.customer).CustomerId;
                    var employeeId = _employeeRepository.FindByName(postItHelpModel.employee).EmployeeId;
                    
                    PostIt postIt = new PostIt()
                    {
                        Title = postItHelpModel.title,
                        From = postItHelpModel.start,
                        To = postItHelpModel.end,
                        Note = postItHelpModel.note,
                        TemplateNo = 0,
                        CreatedDate = DateTime.Now,
                        CustomerId = customerId,
                        EmployeeId = employeeId,

                    };
                    _postItRepo.Insert(postIt);
                    _postItRepo.Save();
                    return Json(true);
                }
            }
            return Json(false);
        }
    }
}