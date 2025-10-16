$(document).ready(function() {
    
    window.customAlert = function(message, type = 'success', callback = null) {
        const alertBox = $('#customAlert');
        const alertMessage = $('#alertMessage');
        const alertButton = $('#alertButton');
        
        alertMessage.text(message);
        
        if (type === 'error') {
            alertBox.css('border-color', '#ff5252'); // لون أحمر للخطأ
            alertButton.css('background-color', '#ff5252');
        } else {
            alertBox.css('border-color', '#2b6ef6'); // لون أزرق للنجاح
            alertButton.css('background-color', '#2b6ef6');
        }

        alertBox.fadeIn(300);

        alertButton.off('click').on('click', function() {
            alertBox.fadeOut(300, function() {
                if (callback) {
                    callback();
                }
            });
        });
    };


    if ($('#appForm').length) {
        
        function validateForm() {
            let isValid = true;
            
            function displayError(id, message) {
                const errorElement = $('#error-' + id);
                if (message) {
                    errorElement.text(message).show();
                    $('#' + id).addClass('error-field');
                    isValid = false;
                } else {
                    errorElement.text('').hide();
                    $('#' + id).removeClass('error-field');
                }
            }

            const appName = $('#appName').val().trim();
            const appNameRegex = /^[a-zA-Z]+$/;
            if (!appName) {
                displayError('appName', 'اسم التطبيق مطلوب.');
            } else if (!appNameRegex.test(appName)) {
                displayError('appName', 'يجب أن يحتوي اسم التطبيق على أحرف إنجليزية فقط وبدون فراغات.');
            } else {
                displayError('appName', '');
            }

            const companyName = $('#companyName').val().trim();
            const companyNameRegex = /^[a-zA-Z\s]+$/; // يسمح بالفراغات بين الكلمات
            if (!companyName) {
                displayError('companyName', 'اسم الشركة المصنعة مطلوب.');
            } else if (!companyNameRegex.test(companyName)) {
                displayError('companyName', 'يجب أن يحتوي اسم الشركة على أحرف إنجليزية فقط.');
            } else {
                displayError('companyName', '');
            }
            
            const websiteUrl = $('#websiteUrl').val().trim();
            const urlRegex = /^(http|https):\/\/[^ "]+$/;
            if (!websiteUrl) {
                displayError('websiteUrl', 'الموقع الإلكتروني مطلوب.');
            } else if (!urlRegex.test(websiteUrl)) {
                displayError('websiteUrl', 'صيغة الموقع الإلكتروني غير صحيحة (يجب أن تبدأ بـ http:// أو https://).');
            } else {
                displayError('websiteUrl', '');
            }

            const description = $('#description').val().trim();
            if (description.length < 10) {
                 displayError('description', 'الشرح المختصر مطلوب ولا يقل عن 10 أحرف.');
            } else {
                 displayError('description', '');
            }

            const category = $('#category').val();
            if (category === "") {
                 displayError('category', 'يجب اختيار مجال استخدام.');
            } else {
                 displayError('category', '');
            }
            
            return isValid;
        }

        $('#submitBtn').on('click', function(e) {
            e.preventDefault(); 
            
            if (validateForm()) {
                
                const newApp = {
                    appName: $('#appName').val().trim(),
                    companyName: $('#companyName').val().trim(),
                    websiteUrl: $('#websiteUrl').val().trim(),
                    isFree: $('input[name="isFree"]:checked').val() === 'yes', // تحويل القيمة إلى منطقية
                    category: $('#category').val(),
                    description: $('#description').val().trim()
                };
                
                try {
                    localStorage.setItem('F24_NEW_APP_DATA', JSON.stringify(newApp));
                    
                    customAlert('تم إدخال بيانات التطبيق بنجاح. سيتم عرضها في صفحة التطبيقات.', 'success', function() {
                         window.location.href = 'app3.html'; 
                    });
                } catch (error) {
                     customAlert('حدث خطأ في تخزين البيانات: ' + error.message, 'error');
                }
            } else {
                customAlert('الرجاء تصحيح الأخطاء في النموذج قبل الإرسال.', 'error');
            }
        });
        
        $('#resetBtn').on('click', function() {
            $('#appForm')[0].reset();
            
            $('.error-message').text('').hide();
            $('input, select, textarea').removeClass('error-field');
        });
    }


    if ($('#appsTable').length) {

        function checkAndDisplayNewApp() {
            const data = localStorage.getItem('F24_NEW_APP_DATA');
            if (data) {
                try {
                    const newApp = JSON.parse(data);
                    
                    const freeStatus = newApp.isFree ? 'مجاني <input type="checkbox" checked>' : 'غير مجاني <input type="checkbox" checked>';
                    const appDetails = newApp.description;
                    const appLink = newApp.websiteUrl;
                    
                    const tableBody = $('.students-table tbody');
                    
                    const newRowNumber = tableBody.find('tr').length + 1;

                    const newRowHtml = `
                         <tr class="new-app-row">
                            <td>${newRowNumber}</td>
                            <td>${newApp.appName}</td>
                            <td>${newApp.companyName}</td>
                            <td>${newApp.category}</td>
                            <td>${freeStatus}</td>
                            <td><label><input type="radio" name="details" value="newApp" data-details='${JSON.stringify({ text: newApp.description, link: newApp.websiteUrl, isNew: true })}' onchange="toggleDetails(this)"> تفاصيل</label></td>
                        </tr>
                    `;
                    
                    tableBody.prepend(newRowHtml);
                    
                    customAlert('تم إضافة التطبيق الجديد: ' + newApp.appName + ' إلى الجدول بنجاح.', 'success');

                    localStorage.removeItem('F24_NEW_APP_DATA');
                } catch (e) {
                    customAlert('خطأ في معالجة البيانات المنقولة: ' + e.message, 'error');
                    localStorage.removeItem('F24_NEW_APP_DATA');
                }
            }
        }
        
        checkAndDisplayNewApp();
    }
    

});

