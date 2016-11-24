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
        public JsonResult GetPostIts(int id)
        {
            List<PostItHelpModel> postItHelpModels = new List<PostItHelpModel>();
            using (IPostItRepository _postItRepository = new PostItRepository(ApplicationDbContext.Create()))
            using (ICustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
            using(IEmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                var postIts = _postItRepository.AllForTemplate(id);
                
                foreach (var postIt in postIts)
                {
                    var customer = _customerRepository.Find(postIt.CustomerId);
                    var employee = _employeeRepository.Find(postIt.EmployeeId);

                    var postItHelpModel = new PostItHelpModel()
                    {
                        id = postIt.EventId,
                        title = postIt.Title,
                        start = string.Format(postIt.From, "s"),
                        end = string.Format(postIt.To, "s"),
                        note = postIt.Note,
                        customerId = postIt.CustomerId,
                        employeeId = postIt.EmployeeId,
                        customerName = customer.Company,
                        employeeName = employee.FirstName,
                        allDay = false,
                        templateNo = postIt.TemplateNo
                    };
                    postItHelpModels.Add(postItHelpModel);
                }
            }
            var rows = postItHelpModels.ToArray();
            return Json(rows, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DelPostIt(int id)
        {
            using (IPostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
            {
                _postItRepo.Delete(id);
                _postItRepo.Save();
                return Json(true);
            }
        }

        public JsonResult UpdatePostIt(PostItHelpModel postItHelpModel)
        {
            if (ModelState.IsValid)
            {
                using (PostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
                using (CustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
                using (EmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    

                    PostIt postIt = _postItRepo.Find(postItHelpModel.id);
                    postIt.Title = postItHelpModel.title;
                    postIt.From = postItHelpModel.start;
                    postIt.To = postItHelpModel.end;
                    postIt.CustomerId = postItHelpModel.customerId;
                    postIt.EmployeeId = postItHelpModel.employeeId;
                    postIt.Note = postItHelpModel.note;
                    postIt.TemplateNo = postItHelpModel.templateNo;
                    _postItRepo.Update(postIt);
                    _postItRepo.Save();
                    return Json(true);
                }
            }
            return Json(false);
           
        }

        public JsonResult CreatePostIt(PostItHelpModel postItHelpModel)
        {
            if (ModelState.IsValid)
            {
                using (PostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
                using (CustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
                using (EmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    PostIt postIt = new PostIt()
                    {
                        Title = postItHelpModel.title,
                        From = postItHelpModel.start,
                        To = postItHelpModel.end,
                        Note = postItHelpModel.note,
                        TemplateNo = postItHelpModel.templateNo,
                        CreatedDate = DateTime.Now,
                        CustomerId = postItHelpModel.customerId,
                        EmployeeId = postItHelpModel.employeeId,

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