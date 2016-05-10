define([
    'jquery'
], function($) {
    var pageTransition = function() {
        this.showView = function(view) {
            this.currentView = view;
            if (this.currentView.preRender) {
                this.currentView.preRender(function() {
                    this.currentView.render();
                }.bind(this));
            } else {
                this.currentView.render();
            }
            // $(".wrapper").attr("class", "wrapper transition");
            slidePage(this.currentView);
        };
    };

    var slidePage = function(page) {
        var slideFrom = 'stage-left',
            pageClass = 'content stage-right',
            $wrapper = $('.wrapper');

        if (!this.currentPage) {
            page.$el.attr('class', 'content stage-center');
            $wrapper.append(page.el);
            this.currentPage = page;
            $('.baseContent').remove();
            return;
        }

        if (App.ReverseTransition) {
            slideFrom = 'stage-right';
            pageClass = 'content stage-left';
        }

        page.$el.attr('class', pageClass);
        App.ReverseTransition = false;

        $wrapper.find('header').after(page.el);
        setTimeout(function() {
            this.currentPage.$el.attr('class', 'content transition ' + slideFrom);
            page.$el.attr('class', 'content transition stage-center');
            this.lastPage = this.currentPage;
            if (this.lastPage.onClose) {
                this.lastPage.onClose();
            }

            this.currentPage = page;
            setTimeout(function() {
                page.$el.removeClass('transition');
                console.log("remove page");
                this.lastPage.remove();
            }.bind(this), 550);
        }.bind(this));
    };

    return {
        pageTransition: pageTransition,
    };

});
