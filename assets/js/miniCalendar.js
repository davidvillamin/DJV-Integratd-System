/**
 * Mini Calendar Component (jQuery Version)
 * 
 * A lightweight, customizable calendar component built with jQuery that supports:
 * - Multiple date selection with color coding
 * - Bootstrap color palette integration (primary, success, danger, warning, info, secondary, dark)
 * - Read-only mode (non-clickable) for display purposes
 * - Month navigation with persistence
 * - Today indicator with boxed outline style
 * - jQuery-style method chaining
 * - Responsive design with Bootstrap classes
 * 
 * @author DJV System
 * @version 2.0.0
 * @requires jQuery
 * @requires Bootstrap (for styling)
 * 
 * USAGE EXAMPLES:
 * 
 * Basic initialization:
 * ```javascript
 * $('#calendar').miniCalendar({
 *     clickable: false,
 *     showToday: true,
 *     initialDates: [
 *         {date: '2025-11-15', title: 'Meeting', color: 'primary'},
 *         {date: '2025-11-20', title: 'Deadline', color: 'danger'}
 *     ]
 * });
 * ```
 * 
 * Method chaining:
 * ```javascript
 * const calendar = $('#calendar').data('miniCalendar');
 * calendar.addDates([{date: '2025-12-01', title: 'Event', color: 'success'}])
 *         .goToDate(2025, 11)
 *         .refresh();
 * ```
 * 
 * OPTIONS:
 * - clickable: {boolean} Allow date clicking (default: true)
 * - showToday: {boolean} Highlight today's date (default: true)
 * - allowMultiple: {boolean} Allow multiple date selection (default: true)
 * - initialDates: {Array} Initial dates with format [{date, title, color}]
 * - onDateSelect: {Function} Callback when dates are selected
 * 
 * DATE FORMAT:
 * {
 *     date: 'YYYY-MM-DD',     // Required: ISO date string
 *     title: 'Event Name',    // Optional: Display title
 *     color: 'success'        // Optional: Bootstrap color (primary, success, danger, warning, info, secondary, dark)
 * }
 * 
 * COLORS AVAILABLE:
 * - primary (blue) - Default
 * - success (green)
 * - danger (red)
 * - warning (yellow)
 * - info (light blue)
 * - secondary (gray)
 * - dark (black)
 * 
 * METHODS:
 * - getSelectedDates(): Get array of selected date objects
 * - setSelectedDates(dates): Set selected dates
 * - addDates(dates): Add new dates
 * - removeDates(dates): Remove specific dates
 * - clearSelectedDates(): Clear all selections
 * - goToDate(year, month): Navigate to specific month
 * - goToToday(): Navigate to current month
 * - refresh(): Re-render calendar
 * - destroy(): Remove calendar from DOM
 * 
 * Supports multiple date selection with persistence across month navigation
 * Requires jQuery to be loaded
 *
 * EXAMPLE USAGE: 
 * $('#miniCalendar').miniCalendar({
 *       clickable: false, // Disable clicking on calendar dates
 *       showToday: true,
 *       initialDates: [
 *           {date: '2025-11-15', title: 'Start Date', color: 'success'},
 *           {date: '2025-11-20', title: 'Meeting', color: 'primary'},
 *           {date: '2025-11-25', title: 'Deadline', color: 'danger'},
 *           {date: '2025-11-26', title: 'Review', color: 'warning'}
 *       ]
 *   });
 * 
 * 
 * 
 */

(function($) {
    'use strict';

    function createMiniCalendar(containerId, options = {}) {
        const $container = $('#' + containerId);
        if ($container.length === 0) {
            console.error(`Container with ID '${containerId}' not found`);
            return null;
        }

        // Default options
        const settings = $.extend({
            onDateSelect: null, // Callback function when dates are selected
            initialDates: [], // Array of initial selected dates with format: [{date: 'YYYY-MM-DD', title: 'Title', color: 'success'}]
            allowMultiple: true, // Allow multiple date selection
            showToday: true, // Highlight today's date
            clickable: true, // Make calendar dates clickable
        }, options);

        // Normalize dates - convert to internal format
        function normalizeDates(dates) {
            // If dates is empty array, empty string, or falsy, return today's date
            if (!dates || dates === '' || (Array.isArray(dates) && dates.length === 0)) {
                const todayStr = new Date().toISOString().split('T')[0];
                return [{ date: todayStr, title: 'Today', color: 'primary' }];
            }
            
            if (!Array.isArray(dates)) return [];
            
            return dates.map(item => {
                if (typeof item === 'string') {
                    // Simple string date
                    return { date: item, title: '', color: 'primary' };
                } else if (typeof item === 'object' && item.date) {
                    // Object with date, title, and color
                    return { 
                        date: item.date, 
                        title: item.title || '',
                        color: item.color || 'primary'
                    };
                }
                return null;
            }).filter(item => item !== null);
        }

        // Convert back to external format
        function exportDates() {
            return selectedDates.map(item => ({
                date: item.date,
                title: item.title,
                color: item.color
            }));
        }

        // Create calendar HTML structure
        $container.html(`
            <div class="mini-calendar">
                <!-- Calendar Navigation -->
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary mc-prev">&lt;</button>
                    <strong class="mx-2 mc-month-year"></strong>
                    <button type="button" class="btn btn-sm btn-outline-secondary mc-next">&gt;</button>
                </div>
                
                <!-- Calendar Table -->
                <table class="table table-sm mb-0">
                    <thead>
                        <tr class="text-center small mc-weekdays"></tr>
                    </thead>
                    <tbody class="mc-dates"></tbody>
                </table>
                
                <!-- Selected dates display -->
                <div class="mt-2">
                    <small class="text-muted">Selected Dates:</small>
                    <div class="mc-selected-dates-display small text-primary">
                        None selected
                    </div>
                </div>
            </div>
        `);

        // Add styles if not already present
        if ($('#miniCalendarStyles').length === 0) {
            $('<style id="miniCalendarStyles">')
                .text(`
                    .mini-calendar td, .mini-calendar th { width: 2.2rem; height: 2.2rem; padding: 0.15rem; }
                    .mini-calendar td button { width: 100%; height: 100%; border: none; background: transparent; }
                    
                    /* Today indicator - no fill, boxed outline style */
                    .mini-calendar td .today { 
                        border: 2px solid #0d6efd; 
                        color: #0d6efd; 
                        border-radius: 0.25rem; 
                        font-weight: bold;
                        background: transparent;
                    }
                    
                    /* Selected dates with colors */
                    .mini-calendar td .selected { border-radius: 0.25rem; color: #fff; }
                    .mini-calendar td .selected.bg-primary { background-color: #0d6efd; }
                    .mini-calendar td .selected.bg-success { background-color: #198754; }
                    .mini-calendar td .selected.bg-danger { background-color: #dc3545; }
                    .mini-calendar td .selected.bg-warning { background-color: #ffc107; color: #000; }
                    .mini-calendar td .selected.bg-info { background-color: #0dcaf0; color: #000; }
                    .mini-calendar td .selected.bg-secondary { background-color: #6c757d; }
                    .mini-calendar td .selected.bg-dark { background-color: #212529; }
                    
                    /* Today + Selected combination */
                    .mini-calendar td .today.selected { 
                        border: 2px solid #fff; 
                        box-shadow: 0 0 0 2px #0d6efd;
                    }
                    
                    /* Clickable date badges */
                    .selected-date-badge {
                        transition: all 0.2s ease;
                        user-select: none;
                    }
                    .selected-date-badge:hover {
                        transform: scale(1.05);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .selected-date-badge:active {
                        transform: scale(0.98);
                    }
                    
                    .mini-calendar td .muted { color: #6c757d; }
                    .mini-calendar td button:hover { background-color: rgba(13,110,253,0.08); border-radius: 0.25rem; }
                    .mini-calendar td button.non-clickable { cursor: default; }
                    .mini-calendar td button.non-clickable:hover { background-color: transparent; }
                `)
                .appendTo('head');
        }

        // Calendar variables
        const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        
        const $mcMonthYear = $container.find('.mc-month-year');
        const $mcWeekdays = $container.find('.mc-weekdays');
        const $mcDates = $container.find('.mc-dates');
        const $prevBtn = $container.find('.mc-prev');
        const $nextBtn = $container.find('.mc-next');
        const $selectedDatesDisplay = $container.find('.mc-selected-dates-display');

        // Array to store selected dates (normalized format)
        let selectedDates = normalizeDates(settings.initialDates);

        // Calendar state
        let today = new Date();
        let viewYear = today.getFullYear();
        let viewMonth = today.getMonth(); // 0-11

        // Helper functions
        function daysInMonth(y, m) { 
            return new Date(y, m + 1, 0).getDate(); 
        }
        
        function formatDate(year, month, day) {
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        
        function isDateSelected(year, month, day) {
            const dateStr = formatDate(year, month, day);
            return selectedDates.some(item => item.date === dateStr);
        }
        
        function getDateObject(year, month, day) {
            const dateStr = formatDate(year, month, day);
            return selectedDates.find(item => item.date === dateStr) || null;
        }
        
        function updateSelectedDatesDisplay() {
            if (selectedDates.length === 0) {
                $selectedDatesDisplay.text('None selected');
            } else {
                const badges = selectedDates.map(item => {
                    const displayDate = formatDisplayDate(item.date);
                    const title = item.title ? ` (${item.title})` : '';
                    const colorClass = `bg-${item.color}`;
                    const textColor = (item.color === 'warning' || item.color === 'info') ? 'text-dark' : '';
                    
                    // Make badge clickable to jump to that date
                    return `<span class="badge ${colorClass} ${textColor} me-1 selected-date-badge" 
                                  title="Click to go to ${item.title || displayDate}" 
                                  data-date="${item.date}" 
                                  style="cursor: pointer;">
                                ${displayDate}${title}
                            </span>`;
                });
                
                // Add today badge if not already in selected dates
                const todayStr = new Date().toISOString().split('T')[0];
                const todayInSelected = selectedDates.some(item => item.date === todayStr);
                
                if (!todayInSelected) {
                    const todayDisplayDate = formatDisplayDate(todayStr);
                    const todayBadge = `<span class="badge bg-secondary text-white me-1 selected-date-badge" 
                                             title="Click to go to Today" 
                                             data-date="${todayStr}" 
                                             style="cursor: pointer;">
                                            ${todayDisplayDate} (Today)
                                        </span>`;
                    badges.unshift(todayBadge); // Add today at the beginning
                }
                
                $selectedDatesDisplay.html(badges.join(''));
                
                // Add click event listeners to badges
                $selectedDatesDisplay.find('.selected-date-badge').off('click').on('click', function() {
                    const dateStr = $(this).data('date');
                    const date = new Date(dateStr);
                    const year = date.getFullYear();
                    const month = date.getMonth(); // 0-11
                    
                    // Jump to the date's month
                    viewYear = year;
                    viewMonth = month;
                    render();
                    
                    // Add visual feedback
                    $(this).addClass('bg-info').removeClass('bg-primary bg-success bg-danger bg-warning bg-secondary bg-dark');
                    setTimeout(() => {
                        updateSelectedDatesDisplay(); // Reset the badge colors
                    }, 500);
                });
            }
        }
        
        function formatDisplayDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        function getWeekDates(startDate) {
            const dates = [];
            const start = new Date(startDate);
            for (let i = 0; i < 7; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                dates.push({
                    date: date.toISOString().split('T')[0],
                    title: ''
                });
            }
            return dates;
        }
        
        function addDateObject(dateObj) {
            const existingIndex = selectedDates.findIndex(item => item.date === dateObj.date);
            if (existingIndex > -1) {
                // Update existing date with new title
                selectedDates[existingIndex] = dateObj;
            } else {
                // Add new date
                selectedDates.push(dateObj);
            }
        }
        
        function removeDateObject(dateStr) {
            selectedDates = selectedDates.filter(item => item.date !== dateStr);
        }
        
        function toggleDateSelection(year, month, day, $btn) {
            // Skip if calendar is not clickable
            if (!settings.clickable) return;
            
            const dateStr = formatDate(year, month, day);
            const existingDate = getDateObject(year, month, day);
            
            if (!settings.allowMultiple) {
                // Clear all previous selections if multiple selection is disabled
                selectedDates = [];
                $mcDates.find('button.selected').removeClass('selected bg-primary bg-success bg-danger bg-warning bg-info bg-secondary bg-dark');
            }
            
            if (existingDate && settings.allowMultiple) {
                // Date is selected, remove it (only if multiple selection is allowed)
                removeDateObject(dateStr);
                $btn.removeClass('selected bg-primary bg-success bg-danger bg-warning bg-info bg-secondary bg-dark');
            } else {
                // Date is not selected, add it
                const newDateObj = { date: dateStr, title: '', color: 'primary' };
                
                if (settings.allowMultiple) {
                    addDateObject(newDateObj);
                } else {
                    selectedDates = [newDateObj];
                }
                $btn.addClass('selected bg-primary');
            }
            
            // Call the callback function if provided
            if (settings.onDateSelect && typeof settings.onDateSelect === 'function') {
                settings.onDateSelect(exportDates(), { date: dateStr, title: '', color: 'primary' });
            }
            
            // Update display
            updateSelectedDatesDisplay();
        }

        function render() {
            $mcMonthYear.text(monthNames[viewMonth] + ' ' + viewYear);
            $mcDates.empty();

            const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0-6
            const totalDays = daysInMonth(viewYear, viewMonth);
            let $row = $('<tr>');
            let dayCount = 0;

            // leading blanks
            for (let i = 0; i < firstDay; i++) {
                $row.append('<td></td>');
                dayCount++;
            }

            for (let d = 1; d <= totalDays; d++) {
                if (dayCount === 7) {
                    $mcDates.append($row);
                    $row = $('<tr>');
                    dayCount = 0;
                }
                
                const $td = $('<td>');
                const $btn = $('<button>', {
                    type: 'button',
                    text: d
                });

                // mark today
                if (settings.showToday && viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate()) {
                    $btn.addClass('today');
                }

                // mark selected dates
                if (isDateSelected(viewYear, viewMonth, d)) {
                    const dateObj = getDateObject(viewYear, viewMonth, d);
                    $btn.addClass('selected bg-' + dateObj.color);
                }

                // Add click event only if clickable
                if (settings.clickable) {
                    $btn.on('click', function() {
                        toggleDateSelection(viewYear, viewMonth, d, $(this));
                    });
                } else {
                    $btn.addClass('non-clickable');
                }

                $td.append($btn);
                $row.append($td);
                dayCount++;
            }

            // trailing blanks
            while (dayCount > 0 && dayCount < 7) {
                $row.append('<td></td>');
                dayCount++;
            }
            $mcDates.append($row);
        }

        // Initialize weekdays header
        $mcWeekdays.html(weekdays.map(d => '<th>' + d + '</th>').join(''));

        // Event listeners
        $prevBtn.on('click', function() {
            viewMonth--;
            if (viewMonth < 0) { 
                viewMonth = 11; 
                viewYear--; 
            }
            render();
        });

        $nextBtn.on('click', function() {
            viewMonth++;
            if (viewMonth > 11) { 
                viewMonth = 0; 
                viewYear++; 
            }
            render();
        });

        // Initial render
        render();
        updateSelectedDatesDisplay();

        // Return API object with jQuery-style chaining
        const api = {
            getSelectedDates: () => exportDates(),
            clearSelectedDates: function() {
                selectedDates = [];
                render();
                updateSelectedDatesDisplay();
                return this; // Enable chaining
            },
            setSelectedDates: function(dates) {
                selectedDates = normalizeDates(dates);
                render();
                updateSelectedDatesDisplay();
                return this; // Enable chaining
            },
            addDates: function(dates) {
                const normalizedDates = normalizeDates(dates);
                normalizedDates.forEach(dateObj => {
                    addDateObject(dateObj);
                });
                render();
                updateSelectedDatesDisplay();
                return this; // Enable chaining
            },
            removeDates: function(dates) {
                const datesToRemove = Array.isArray(dates) ? dates : [dates];
                datesToRemove.forEach(date => {
                    const dateStr = typeof date === 'string' ? date : date.date;
                    removeDateObject(dateStr);
                });
                render();
                updateSelectedDatesDisplay();
                return this; // Enable chaining
            },
            goToDate: function(year, month) {
                viewYear = year;
                viewMonth = month;
                render();
                return this; // Enable chaining
            },
            goToToday: function() {
                viewYear = today.getFullYear();
                viewMonth = today.getMonth();
                render();
                return this; // Enable chaining
            },
            refresh: function() {
                render();
                return this; // Enable chaining
            },
            destroy: function() {
                $container.empty();
                return this; // Enable chaining
            },
            // jQuery specific methods
            getContainer: () => $container,
            getElement: (selector) => $container.find(selector),
            
            // jQuery-style event handling
            on: function(event, callback) {
                if (event === 'dateSelect' || event === 'select') {
                    settings.onDateSelect = callback;
                }
                return this; // Enable chaining
            },
            
            // jQuery-style data methods
            data: function(key, value) {
                if (value !== undefined) {
                    $container.data(key, value);
                    return this; // Enable chaining
                }
                return $container.data(key);
            },
            
            // jQuery-style addClass/removeClass for container
            addClass: function(className) {
                $container.addClass(className);
                return this; // Enable chaining
            },
            removeClass: function(className) {
                $container.removeClass(className);
                return this; // Enable chaining
            },
            
            // jQuery-style show/hide
            show: function() {
                $container.show();
                return this; // Enable chaining
            },
            hide: function() {
                $container.hide();
                return this; // Enable chaining
            }
        };
        
        return api;
    }

    // Make it available globally and as jQuery plugin
    window.createMiniCalendar = createMiniCalendar;
    
    // jQuery plugin version with enhanced chaining
    $.fn.miniCalendar = function(options) {
        if (typeof options === 'string') {
            // Handle method calls like $('#cal').miniCalendar('addDates', [...])
            const method = options;
            const args = Array.prototype.slice.call(arguments, 1);
            
            return this.each(function() {
                const calendar = $(this).data('miniCalendar');
                if (calendar && typeof calendar[method] === 'function') {
                    calendar[method].apply(calendar, args);
                }
            });
        } else {
            // Initialize calendar
            return this.each(function() {
                const $this = $(this);
                const id = $this.attr('id') || 'miniCal_' + Math.random().toString(36).substr(2, 9);
                if (!$this.attr('id')) {
                    $this.attr('id', id);
                }
                const calendar = createMiniCalendar(id, options);
                $this.data('miniCalendar', calendar);
                
                // Return the calendar instance for chaining
                return calendar;
            });
        }
    };

})(jQuery);