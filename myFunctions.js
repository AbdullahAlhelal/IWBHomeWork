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


   const detailsData = {
      ChatGPT: {
        text: "تصميم صور،نصوص،دردشة،كتابة،برمجة،تلخيص",
        img: "media/ChatGPT.png",
         video: "media/HB.mp4",
        link: "https://openai.com"
      },
      Runway: {
        text: "إنشاء فيديوهات ووسائط متعددة باستخدام الذكاء الاصطناعي",
        img: "media/Runway.png",
        link: "https://Runway.com"
      },
      Photomath: {
        text: "يستخدم كاميرا الهاتف لالتقاط المعادلات أو المسائل الرياضية حتى المكتوبة بخط اليد ثم يعرض الحل خطوة بخطوة",
        img: "media/Photomath.png",
        audio: "media/m.wav",
        link: "https://photomath.com"
      },
      Khanmigo: {
        text: "مساعد دراسي في مواضع متنوعة(رياضيات-علوم-برمجة-كتابة) يهدف إلى أن لايعطي الإجابة مباشرةً بل بل يوجه الطالب للتفكير والاستنتاج",
        img: "media/Khanmigo.png",
        link: "https://Khanmigo.ai"
      },
      Grammarly: {
        text: "تصحيح لغوي،تحسين الأسلوب،اقتراحات الكتابة",
        img: "media/Grammarly.png",
        link: "https://www.Grammarly.com"
      }
    };
    let lastSelected = null;

    function toggleDetails(radio) {
      $(".details-row").remove();

      if (lastSelected === radio) {
        radio.checked = false;
        lastSelected = null;
        return;
      }

      lastSelected = radio;
      
      let app;
      if (radio.value === "newApp") {
          app = $(radio).data('details');
      } else {
          app = detailsData[radio.value];
      }

      if (!app) return;

      const detailsRow = document.createElement("tr");
      detailsRow.className = "details-row";

      const cell = document.createElement("td");
      cell.colSpan = 6;

      const container = document.createElement("div");
      container.className = "details-content";

      if (app.img && !app.isNew) {
        const img = document.createElement("img");
        img.src = app.img;
        img.alt = radio.value;
        container.appendChild(img);
      } else if (app.isNew) {
         const placeholder = document.createElement("div");
         placeholder.textContent = "لا يوجد صورة/ملتيميديا لهذا التطبيق الجديد";
         placeholder.style.cssText = "padding: 20px; border: 1px dashed #ccc; border-radius: 8px; color: var(--muted);";
         container.appendChild(placeholder);
      }
      
      const textDiv = document.createElement("div");
      textDiv.className = "details-text";
      
      const descPara = document.createElement("p");
      descPara.innerHTML = `<b>شرح مختصر:</b> ${app.text}`;
      textDiv.appendChild(descPara);
      
      const linkPara = document.createElement("p");
      linkPara.innerHTML = `<b>عنوان الموقع الإلكتروني:</b> <a href="${app.link}" target="_blank" class="App-app-link-small">${app.link}</a>`;
      textDiv.appendChild(linkPara);

      container.appendChild(textDiv);

      if (app.audio && !app.isNew) {
        const audio = document.createElement("audio");
        audio.src = app.audio;
        audio.controls = true;
        container.appendChild(audio);
      }
      if (app.video && !app.isNew) {
        const video = document.createElement("video");
        video.src = app.video;
        video.controls = true;
        video.width = 200;
        container.appendChild(video);
      }


     cell.appendChild(container);
      detailsRow.appendChild(cell);
      radio.closest("tr").insertAdjacentElement("afterend", detailsRow);
    }
    
    $(document).on('click', '.new-app-row input[type="radio"]', function() {
        toggleDetails(this);
    });

