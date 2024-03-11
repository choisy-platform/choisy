using System.Net;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Nop.Core;
using Nop.Core.Domain.Customers;
using Nop.Core.Domain.Directory;
using Nop.Core.Domain.Forums;
using Nop.Core.Domain.Gdpr;
using Nop.Core.Domain.Localization;
using Nop.Core.Domain.Media;
using Nop.Core.Domain.Tax;
using Nop.Core.Events;
using Nop.Core.Infrastructure;
using Nop.Services.Authentication;
using Nop.Services.Authentication.External;
using Nop.Services.Catalog;
using Nop.Services.Common;
using Nop.Services.Customers;
using Nop.Services.Directory;
using Nop.Services.Gdpr;
using Nop.Services.Helpers;
using Nop.Services.Localization;
using Nop.Services.Logging;
using Nop.Services.Media;
using Nop.Services.Messages;
using Nop.Services.Orders;
using Nop.Services.Payments;
using Nop.Services.Tax;
using Nop.Services.Vendors;
using Nop.Web.Areas.Admin.Factories;
using Nop.Web.Areas.Api.Models;
using ILogger = Nop.Services.Logging.ILogger;

namespace Nop.Web.Areas.Api.Controllers
{
    public class CustomerController : BaseApiController
    {
        #region Constants & Fields 

        private readonly ICustomerService _customerService;
        private readonly IWorkContext _workContext;
        private readonly ILogger _logger;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEventPublisher _eventPublisher;
        private readonly IStoreContext _storeContext;
        private readonly ICustomerRegistrationService _customerRegistrationService;
        private readonly IGenericAttributeService _genericAttributeService;
        private readonly ITaxService _taxService;
        private readonly IWorkflowMessageService _workflowMessageService;
        private readonly INewsLetterSubscriptionService _newsLetterSubscriptionService;
        private readonly IGdprService _gdprService;
        private readonly ILocalizationService _localizationService;
        private readonly IAddressService _addressService;
        private readonly IWebHelper _webHelper;
        private readonly ICustomerModelFactory _customerModelFactory;
        private readonly IShoppingCartService _shoppingCartService;
        private readonly ICustomerActivityService _customerActivityService;
        private readonly IOrderService _orderService;
        private readonly IDateTimeHelper _dateTimeHelper;
        private readonly IOrderProcessingService _orderProcessingService;
        private readonly ICurrencyService _currencyService;
        private readonly IPriceFormatter _priceFormatter;
        private readonly IProductService _productService;
        private readonly IVendorService _vendorService;
        private readonly IPictureService _pictureService;
        private readonly IDownloadService _downloadService;
        private readonly IProductModelFactory _productModelFactory;
        private readonly IPaymentPluginManager _paymentPluginManager;
        private readonly IPaymentService _paymentService;
        private readonly IOrderModelFactory _orderModelFactory;
        private readonly IExternalAuthenticationService _externalAuthenticationService;

        private readonly CustomerSettings _customerSettings;
        private readonly DateTimeSettings _dateTimeSettings;
        private readonly TaxSettings _taxSettings;
        private readonly LocalizationSettings _localizationSettings;
        private readonly GdprSettings _gdprSettings;
        private readonly ForumSettings _forumSettings;
        private readonly CurrencySettings _currencySettings;
        private readonly MediaSettings _mediaSettings;

        public CustomerController()
        {
            this._customerService = EngineContext.Current.Resolve<ICustomerService>();
            this._workContext = EngineContext.Current.Resolve<IWorkContext>();
            this._logger = EngineContext.Current.Resolve<ILogger>();
            this._authenticationService = EngineContext.Current.Resolve<IAuthenticationService>();
            this._eventPublisher = EngineContext.Current.Resolve<IEventPublisher>();
            this._storeContext = EngineContext.Current.Resolve<IStoreContext>();
            this._customerRegistrationService = EngineContext.Current.Resolve<ICustomerRegistrationService>();
            this._genericAttributeService = EngineContext.Current.Resolve<IGenericAttributeService>();
            this._taxService = EngineContext.Current.Resolve<ITaxService>();
            this._workflowMessageService = EngineContext.Current.Resolve<IWorkflowMessageService>();
            this._newsLetterSubscriptionService = EngineContext.Current.Resolve<INewsLetterSubscriptionService>();
            this._gdprService = EngineContext.Current.Resolve<IGdprService>();
            this._localizationService = EngineContext.Current.Resolve<ILocalizationService>();
            this._addressService = EngineContext.Current.Resolve<IAddressService>();
            this._webHelper = EngineContext.Current.Resolve<IWebHelper>();
            this._customerModelFactory = EngineContext.Current.Resolve<ICustomerModelFactory>();
            this._shoppingCartService = EngineContext.Current.Resolve<IShoppingCartService>();
            this._customerActivityService = EngineContext.Current.Resolve<ICustomerActivityService>();
            this._orderService = EngineContext.Current.Resolve<IOrderService>();
            this._dateTimeHelper = EngineContext.Current.Resolve<IDateTimeHelper>();
            this._orderProcessingService = EngineContext.Current.Resolve<IOrderProcessingService>();
            this._currencyService = EngineContext.Current.Resolve<ICurrencyService>();
            this._priceFormatter = EngineContext.Current.Resolve<IPriceFormatter>();
            this._productService = EngineContext.Current.Resolve<IProductService>();
            this._vendorService = EngineContext.Current.Resolve<IVendorService>();
            this._pictureService = EngineContext.Current.Resolve<IPictureService>();
            this._downloadService = EngineContext.Current.Resolve<IDownloadService>();
            this._productModelFactory = EngineContext.Current.Resolve<IProductModelFactory>();
            this._paymentPluginManager = EngineContext.Current.Resolve<IPaymentPluginManager>();
            this._paymentService = EngineContext.Current.Resolve<IPaymentService>();
            this._externalAuthenticationService = EngineContext.Current.Resolve<IExternalAuthenticationService>();
            this._orderModelFactory = EngineContext.Current.Resolve<IOrderModelFactory>();

            this._customerSettings = EngineContext.Current.Resolve<CustomerSettings>();
            this._dateTimeSettings = EngineContext.Current.Resolve<DateTimeSettings>();
            this._taxSettings = EngineContext.Current.Resolve<TaxSettings>();
            this._localizationSettings = EngineContext.Current.Resolve<LocalizationSettings>();
            this._gdprSettings = EngineContext.Current.Resolve<GdprSettings>();
            this._forumSettings = EngineContext.Current.Resolve<ForumSettings>();
            this._currencySettings = EngineContext.Current.Resolve<CurrencySettings>();
            this._mediaSettings = EngineContext.Current.Resolve<MediaSettings>();
        }

        #endregion

        [HttpGet("GetGuestCustomer")]
        public async Task<HttpResponseModel<object>> GetGuestCustomer(string token = "")
        {
            try
            {
                Customer customer = null;
                if (!string.IsNullOrEmpty(token))
                {
                    var guid = Guid.Parse(token);
                    customer = await _customerService.GetCustomerByGuidAsync(guid);
                }

                if (customer == null)
                    customer = await _customerService.InsertGuestCustomerAsync();

                var model = await this.PrepareCustomerInfo(customer);

                var result = new HttpResponseModel<object>
                {
                    StatusCode = HttpStatusCode.OK,
                    Data = model
                };
                return result;
            }
            catch (Exception ex)
            {
                await _logger.ErrorAsync(ex.Message, ex);

                return new HttpResponseModel<object>
                {
                    Exception = ex
                };
            }
        }

        [HttpGet("GetCustomer")]
        public async Task<HttpResponseModel<object>> GetCustomer()
        {
            var customer = await _workContext.GetCurrentCustomerAsync();
            var model = await PrepareCustomerInfo(customer);

            return new HttpResponseModel<object>
            {
                StatusCode = HttpStatusCode.OK,
                Data = model
            };
        }

        [HttpPost("UpdateCustomer")]
        public async Task<HttpResponseModel<object>> UpdateCustomer(ParamsModel.CustomerUpdateParamsModel paramsModel)
        {
            var customer = await _workContext.GetCurrentCustomerAsync();
            if (!await _customerService.IsRegisteredAsync(customer))
                return new HttpResponseModel<object>
                {
                    StatusCode = HttpStatusCode.BadRequest
                };


            //if (!string.IsNullOrEmpty(paramsModel.Fullname))
            //    await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.FirstNameAttribute, paramsModel.Fullname);

            //if (!string.IsNullOrEmpty(paramsModel.Phone))
            //    await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.PhoneAttribute, paramsModel.Phone);

            if (!string.IsNullOrEmpty(paramsModel.NewPassword) && !string.IsNullOrEmpty(paramsModel.OldPassword))
            {
                var changePasswordRequest = new ChangePasswordRequest(customer.Email,
                    true, _customerSettings.DefaultPasswordFormat, paramsModel.NewPassword, paramsModel.OldPassword);
                var changePasswordResult = await _customerRegistrationService.ChangePasswordAsync(changePasswordRequest);
                if (!changePasswordResult.Success)
                {
                    //errors
                    return new HttpResponseModel<object>
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = string.Join(", ", changePasswordResult.Errors)
                    };
                }
            }

            var model = await PrepareCustomerInfo(customer);
            return new HttpResponseModel<object>
            {
                StatusCode = HttpStatusCode.OK,
                Data = model
            };
        }

        [HttpPost("Login")]
        public async Task<HttpResponseModel<object>> Login([FromBody] ParamsModel.LoginParamsModel loginParamsModel)
        {
            ////validate CAPTCHA
            //if (_captchaSettings.Enabled && _captchaSettings.ShowOnLoginPage && !captchaValid)
            //{
            //    ModelState.AddModelError("", await _localizationService.GetResourceAsync("Common.WrongCaptchaMessage"));
            //}

            string errorMessage = string.Empty;
            if (string.IsNullOrEmpty(loginParamsModel.Username))
                errorMessage = await _localizationService.GetResourceAsync("Account.Login.Fields.Email.Required"
                    , (await _workContext.GetWorkingLanguageAsync()).Id);
            else if (string.IsNullOrEmpty(loginParamsModel.Username))
                errorMessage = await _localizationService.GetResourceAsync("Account.Fields.ConfirmPassword.Required"
                    , (await _workContext.GetWorkingLanguageAsync()).Id);

            var model = new
            {
                Username = loginParamsModel.Username.Trim(),
                Email = loginParamsModel.Username.Trim(),
                Password = loginParamsModel.Password,
                RememberMe = false
            };

            if (!string.IsNullOrEmpty(errorMessage))
            {
                return new HttpResponseModel<object>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = errorMessage
                };
            }

            try
            {
                var loginResult = await _customerRegistrationService.ValidateCustomerAsync(
                    _customerSettings.UsernamesEnabled ? model.Username : model.Email, model.Password);
                switch (loginResult)
                {
                    case CustomerLoginResults.Successful:
                        {
                            var customer = _customerSettings.UsernamesEnabled
                                ? await _customerService.GetCustomerByUsernameAsync(model.Username)
                                : await _customerService.GetCustomerByEmailAsync(model.Email);

                            if ((await _workContext.GetCurrentCustomerAsync())?.Id != customer.Id)
                            {
                                //migrate shopping cart
                                await _shoppingCartService.MigrateShoppingCartAsync(await _workContext.GetCurrentCustomerAsync(), customer, true);

                                await _workContext.SetCurrentCustomerAsync(customer);
                            }

                            //sign in new customer
                            await _authenticationService.SignInAsync(customer, model.RememberMe);

                            //raise event       
                            await _eventPublisher.PublishAsync(new CustomerLoggedinEvent(customer));

                            //activity log
                            await _customerActivityService.InsertActivityAsync(customer, "PublicStore.Login",
                                await _localizationService.GetResourceAsync("ActivityLog.PublicStore.Login"), customer);

                            var infor = await this.PrepareCustomerInfo(customer);
                            return new HttpResponseModel<object>
                            {
                                Data = infor,
                                StatusCode = HttpStatusCode.OK
                            };
                        }
                    case CustomerLoginResults.CustomerNotExist:
                        return new HttpResponseModel<object>
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Data = false,
                            Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.CustomerNotExist"
                                , (await _workContext.GetWorkingLanguageAsync()).Id)
                        };
                    case CustomerLoginResults.Deleted:
                        return new HttpResponseModel<object>
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Data = false,
                            Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.Deleted"
                                , (await _workContext.GetWorkingLanguageAsync()).Id)
                        };
                    case CustomerLoginResults.NotActive:
                        return new HttpResponseModel<object>
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Data = false,
                            Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.NotActive"
                                , (await _workContext.GetWorkingLanguageAsync()).Id)
                        };
                    case CustomerLoginResults.NotRegistered:
                        return new HttpResponseModel<object>
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Data = false,
                            Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.NotRegistered"
                                , (await _workContext.GetWorkingLanguageAsync()).Id)
                        };
                    case CustomerLoginResults.LockedOut:
                        return new HttpResponseModel<object>
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Data = false,
                            Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials.LockedOut"
                                , (await _workContext.GetWorkingLanguageAsync()).Id)
                        };
                    case CustomerLoginResults.WrongPassword:
                    default:
                        return new HttpResponseModel<object>
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Data = false,
                            Message = await _localizationService.GetResourceAsync("Account.Login.WrongCredentials"
                                , (await _workContext.GetWorkingLanguageAsync()).Id)
                        };
                }
            }
            catch (Exception ex)
            {
                await _logger.ErrorAsync(ex.Message, ex, await _workContext.GetCurrentCustomerAsync());

                return new HttpResponseModel<object>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Data = false,
                    Exception = ex
                };
            }
        }

        [HttpPost("PasswordRecoverySend")]
        public async Task<HttpResponseModel<object>> PasswordRecoverySend(ParamsModel.PasswordRecoveryParamsModel model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                return new HttpResponseModel<object>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = await _localizationService.GetResourceAsync("Account.Login.Fields.Email.Required", (await _workContext.GetWorkingLanguageAsync()).Id)
                };
            }

            var customer = await _customerService.GetCustomerByEmailAsync(model.Email);
            if (customer == null || customer.Deleted || !customer.Active)
            {
                return new HttpResponseModel<object>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = await _localizationService.GetResourceAsync("Account.PasswordRecovery.EmailNotFound", (await _workContext.GetWorkingLanguageAsync()).Id)
                };
            }

            //save token and current date
            var passwordRecoveryToken = Guid.NewGuid();
            await _genericAttributeService.SaveAttributeAsync(customer, NopCustomerDefaults.PasswordRecoveryTokenAttribute,
                passwordRecoveryToken.ToString());

            DateTime? generatedDateTime = DateTime.UtcNow;
            await _genericAttributeService.SaveAttributeAsync(customer,
                NopCustomerDefaults.PasswordRecoveryTokenDateGeneratedAttribute, generatedDateTime);

            //send email
            await _workflowMessageService.SendCustomerPasswordRecoveryMessageAsync(customer,
                (await _workContext.GetWorkingLanguageAsync()).Id);

            return new HttpResponseModel<object>
            {
                StatusCode = HttpStatusCode.OK,
                Message = await _localizationService.GetResourceAsync("Account.PasswordRecovery.EmailHasBeenSent", (await _workContext.GetWorkingLanguageAsync()).Id)
            };
        }

        #region Utillites

        private async Task<object> PrepareCustomerInfo(Customer customer)
        {
            var model = new
            {
                Id = customer.Id,
                CustomerGuid = customer.CustomerGuid.ToString(),
                RegisteredInStoreId = customer.RegisteredInStoreId,
                Email = !string.IsNullOrEmpty(customer.Email) ? customer.Email.ToLower() : customer.CustomerGuid.ToString(),
                IsGuest = await _customerService.IsGuestAsync(customer),
                IsVendor = await _customerService.IsVendorAsync(customer),
                IsAdmin = await _customerService.IsAdminAsync(customer),
                CustomerRoles = (await _customerService.GetCustomerRolesAsync(customer)).Select(r => new
                {
                    r.Id,
                    r.SystemName
                }),
                //FirstName = await _genericAttributeService.GetAttributeAsync<string>(customer, NopCustomerDefaults.FirstNameAttribute),
                FirstName = customer.FirstName,
                //LastName = await _genericAttributeService.GetAttributeAsync<string>(customer, NopCustomerDefaults.LastNameAttribute),
                LastName = customer.LastName,
                FullName = await _customerService.GetCustomerFullNameAsync(customer),
                Phone = customer.Phone,
                //Phone = await _genericAttributeService.GetAttributeAsync<string>(customer, NopCustomerDefaults.PhoneAttribute)
                //AvatarUrl = _pictureService.GetPictureUrl(guestCustomer.GetAttribute<int>(SystemCustomerAttributeNames.AvatarPictureId)),
                //FormattedUserName = guestCustomer.FormatUsername()
            };

            return model;
        }


        #endregion
    }
}