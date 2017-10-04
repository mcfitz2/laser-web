app = {};

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function loadMaterials() {
    $.getJSON("/material", function(data) {
        app.materials = data;
    });
}

function loadMachines() {
    $.getJSON("/machine", function(data) {
        app.machines = data;
    });
}

function loadImageList(callback) {
    var jqxhr = $.getJSON("/image", function(data) {
        app.images = data.map((img) => {
            if (img.dpi == undefined) {
                img.dpi = 500;
            }
            return img;
        });
    }).done(function() {}).fail(function() {}).always(function() {
        callback();
    });
}

function baseName(str) {
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
    if (base.lastIndexOf(".") != -1) base = base.substring(0, base.lastIndexOf("."));
    return base;
}

function uploadImage() {


    $.ajax({
        url: '/image',
        type: 'POST',
        data: new FormData($('#uploadform')[0]),
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function(data, status) {
            selectImage(data._id)
            loadImageList(function() {});
        }
    });
}

function selectImage(id) {
    for (var i = 0; i < app.images.length; i++) {
        if (app.images[i]._id == id) {
            app.selectedImage = app.images[i];
            app.selectedImage.dpi = 500;
            break;
        }
    }
}

function generateGcode(app) {
    var offset_x = app.selectedImage.offset_x;
    var offset_y = app.selectedImage.offset_y;
    var machine_id = app.selectedMachine;
    var material_id = app.selectedMaterial;
    var image_id = app.selectedImage._id;
    $.get("/gcode/generate", {
        image_id: image_id,
        machine_profile_id: machine_id,
        material_profile_id: material_id,
        dimension_x: 25.4 * (app.selectedImage.width / app.selectedImage.dpi),
        dimension_y: 25.4 * (app.selectedImage.height / app.selectedImage.dpi),
        offset_x: offset_x,
        offset_y: offset_y
    }, function(data) {
        app.gcode = data;
    }, "text");
}

$(function() {
    loadMachines()
    loadMaterials()
    loadImageList(function() {
        selectImage(app.images[0]._id);
        rivets.formatters.in_to_mm = function(val) {
            return round(val * 25.4, 2);
        }
        rivets.formatters.since = function(val) {
            return moment.duration(Math.abs(new Date() - moment(val).toDate())).humanize()
        }
        rivets.formatters.width = function(val) {
            if (app.selectedImage && app.selectedImage.width) {;
                return round(app.selectedImage.width / val, 2);
            } else {
                return 0;
            }
        }
        rivets.formatters.height = function(val) {
            if (app.selectedImage && app.selectedImage.height) {
                return round(app.selectedImage.height / val, 2);
            } else {
                return 0;
            }
        };
        rivets.bind(document.querySelector('body'), // bind to the element with id "candy-shop"
            {
                app: app,
                controllers: {
                    onImageClick: (e, model) => {
                        app.selectedImage = model.image;
                        $('.nav-tabs a[href="#image-view"]').tab('show');
                    },
                    onGenerateClicked: (e, model) => {
                        generateGcode(model.app);
                    },
                    onSaveGCode: (e, model) => {
                        var a = window.document.createElement('a');
                        a.href = window.URL.createObjectURL(new Blob([model.app.gcode], {
                            type: 'text/plain'
                        }));
                        a.download = model.app.selectedImage.name + ".gcode";
                        document.body.appendChild(a)
                        a.click();
                        document.body.removeChild(a)
                    }
                }
            });
    });
});