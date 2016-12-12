using Fjordens_Service_ver2.DAL.Contracts;
using Fjordens_Service_ver2.DAL.Repositories;
using Fjordens_Service_ver2.Models;
using Fjordens_Service_ver2.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fjordens_Service_ver2.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        public ActionResult Index()
        {
            using(ICustomerRepository _customerRepo = new CustomerRepository(ApplicationDbContext.Create()))
            {
                CustomersViewModel viewModel = new CustomersViewModel()
                {
                    Customers = _customerRepo.All().ToList()
                };
                return View(viewModel);
            }
            
        }

        // GET: Customer/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Customer/Create
        [HttpPost]
        public ActionResult Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                using(ICustomerRepository _customerRepo = new CustomerRepository(ApplicationDbContext.Create()))
                {
                    _customerRepo.Insert(customer);
                    _customerRepo.Save();
                    return RedirectToAction("Index");
                }
            }
            return View(customer);
        }

        // GET: Customer/Edit/5
        public ActionResult Edit(int id)
        {
            using (ICustomerRepository _customerRepo = new CustomerRepository(ApplicationDbContext.Create()))
            {
                Customer customer = _customerRepo.Find(id);
                return View(customer);
            }
                
        }

        // POST: Customer/Edit/
        [HttpPost]
        public ActionResult Edit(Customer customer)
        {
            if (ModelState.IsValid)
            {
                using (ICustomerRepository _customerRepo = new CustomerRepository(ApplicationDbContext.Create()))
                {
                    _customerRepo.Update(customer);
                    _customerRepo.Save();
                    return RedirectToAction("Index");
                }
            }
            return View(customer);
            
        }

        // POST: Customer/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            using (ICustomerRepository _customerRepo = new CustomerRepository(ApplicationDbContext.Create()))
            using(IPostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
            {
                var postItsForCus = _postItRepo.AllForCustomer(id).ToList();
                foreach(var postIt in postItsForCus)
                {
                    postIt.IsAssigned = false;
                    _postItRepo.Update(postIt);
                    _postItRepo.Save();
                }

                _customerRepo.Delete(id);
                _customerRepo.Save();
                return RedirectToAction("Index");
            }
        }
    }
}
