/* @ds-bundle: {"format":4,"namespace":"Aambience","components":[{"name":"Button"},{"name":"TextInput"},{"name":"Chip"},{"name":"Icon"},{"name":"Logo"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Toggle"},{"name":"Slider"},{"name":"Snackbar"},{"name":"Label"},{"name":"Dropdown"},{"name":"SearchInput"},{"name":"Table"},{"name":"Header"},{"name":"MenuItem"},{"name":"SubmenuItem"},{"name":"SideNav"},{"name":"MenuDropdown"},{"name":"DropdownItem"},{"name":"HistoryCard"},{"name":"ContactCard"},{"name":"CompanyCard"},{"name":"EntranceCard"},{"name":"DayCard"},{"name":"ConfirmationDialog"},{"name":"Modal"},{"name":"StatusBadge"},{"name":"CertificationRow"},{"name":"DeviceCard"},{"name":"MonthCalendar"}]} */
(function () {
  var R = window.React, h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  /* Icon lives in components/Icon/part.js; resolved at render time. */
  function Icon(p) { var I = window.Aambience && window.Aambience.Icon; return I ? h(I, p) : null; }
  function Button(p) {
    var color = p.color || "main", roundness = p.roundness || "sm";
    var rest = Object.assign({}, p);
    ["color", "roundness", "leadingIcon", "trailingIcon", "children", "className", "state"].forEach(function (k) { delete rest[k]; });
    var li = p.leadingIcon, ti = p.trailingIcon;
    return h("button", Object.assign({ type: "button" }, rest, {
      className: cx("aa-btn", "aa-btn--" + color, "aa-btn--r-" + roundness, p.state ? "is-" + p.state : null, p.className)
    }),
      li ? (typeof li === "string" ? h(Icon, { name: li, size: 18 }) : li) : null,
      p.children != null ? h("span", { className: "aa-btn__label" }, p.children) : null,
      ti ? (typeof ti === "string" ? h(Icon, { name: ti, size: 18 }) : ti) : null);
  }
  var uid = 0;
  function TextInput(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = p.id || "aa-input-" + (++uid);
    var id = idRef.current, err = !!p.error;
    var rest = Object.assign({}, p);
    ["label", "helper", "error", "multiline", "stroke", "filled", "icon", "className", "id", "required"].forEach(function (k) { delete rest[k]; });
    var Field = p.multiline ? "textarea" : "input";
    var helpId = (p.helper || typeof p.error === "string") ? id + "-help" : undefined;
    return h("div", { className: cx("aa-field", err && "is-error", p.className) },
      p.label ? h("label", { className: "aa-field__label", htmlFor: id }, p.label, p.required ? "*" : null) : null,
      (function () {
        var control = h(Field, Object.assign({ id: id, "aria-invalid": err || undefined, "aria-describedby": helpId, required: p.required }, rest, {
          className: cx("aa-field__control", p.multiline && "aa-field__control--multi", p.stroke === "bottom" && "aa-field__control--bottom", p.filled && "aa-field__control--filled")
        }));
        if (!p.icon) return control;
        /* Figma Icon=yes: info-18px inside the field; with Error=yes it becomes close-18px in a red ring. */
        var icon = err ? h("span", { className: "aa-field__icon aa-field__icon--error", "aria-hidden": "true" }, h(Icon, { name: "close", size: 16 }))
          : h("span", { className: "aa-field__icon", "aria-hidden": "true" }, h(Icon, { name: p.icon === true ? "info" : p.icon, size: 18 }));
        return h("div", { className: cx("aa-field__wrap", p.multiline && "aa-field__wrap--multi") }, control, icon);
      })(),
      helpId ? h("span", { id: helpId, className: "aa-field__help" }, typeof p.error === "string" ? p.error : p.helper) : null);
  }
  function Chip(p) {
    var color = p.color || "brand", roundness = p.roundness || "default";
    var body = [
      p.icon ? h(Icon, { key: "i", name: p.icon === true ? "person" : p.icon, size: 18 }) : null,
      h("span", { key: "l", className: "aa-chip__label" }, p.children),
      p.onRemove ? h("button", { key: "x", type: "button", className: "aa-chip__remove", "aria-label": "Remove " + (typeof p.children === "string" ? p.children : ""), onClick: p.onRemove, disabled: p.disabled }, h(Icon, { name: "close", size: 18 })) : null
    ];
    var cls = cx("aa-chip", "aa-chip--" + color, "aa-chip--r-" + roundness, p.selected && "is-selected", p.disabled && "is-disabled", p.className);
    if (p.onClick) return h("button", { type: "button", className: cls, onClick: p.onClick, disabled: p.disabled, "aria-pressed": p.selected ? "true" : "false" }, body);
    return h("span", { className: cls }, body);
  }
  window.Aambience = Object.assign(window.Aambience || {}, { Button: Button, TextInput: TextInput, Chip: Chip });
})();
/* Icon */
/* Icon — 115 icons from Figma "Design kit" › icons (145:746), 24px masters. Generated from ref/aicons; do not edit paths by hand. */
(function(){ var R=window.React,h=R.createElement;
  var ICONS={"priority_high":"<path d=\"M12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21Z\" fill=\"currentColor\"/><path d=\"M10 3H14V15H10V3Z\" fill=\"currentColor\"/>","confirmation_number":"<path d=\"M22 10V6C22 4.89 21.1 4 20 4H4C2.9 4 2.01 4.89 2.01 6V10C3.11 10 4 10.9 4 12C4 13.1 3.11 14 2 14V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V14C20.9 14 20 13.1 20 12C20 10.9 20.9 10 22 10ZM20 8.54C18.81 9.23 18 10.53 18 12C18 13.47 18.81 14.77 20 15.46V18H4V15.46C5.19 14.77 6 13.47 6 12C6 10.52 5.2 9.23 4.01 8.54L4 6H20V8.54ZM11 15H13V17H11V15ZM11 11H13V13H11V11ZM11 7H13V9H11V7Z\" fill=\"currentColor\"/>","low_priority":"<path d=\"M14 4.5H22V6.5H14V4.5ZM14 10H22V12H14V10ZM14 15.5H22V17.5H14V15.5ZM2 11C2 14.58 4.92 17.5 8.5 17.5H9V19.5L12 16.5L9 13.5V15.5H8.5C6.02 15.5 4 13.48 4 11C4 8.52 6.02 6.5 8.5 6.5H12V4.5H8.5C4.92 4.5 2 7.42 2 11Z\" fill=\"currentColor\"/>","arrow_drop_down":"<path d=\"M7 9.5L12 14.5L17 9.5H7Z\" fill=\"currentColor\"/>","attach_file":"<path d=\"M16 6V17.5C16 19.71 14.21 21.5 12 21.5C9.79 21.5 8 19.71 8 17.5V5C8 3.62 9.12 2.5 10.5 2.5C11.88 2.5 13 3.62 13 5V15.5C13 16.05 12.55 16.5 12 16.5C11.45 16.5 11 16.05 11 15.5V6H9.5V15.5C9.5 16.88 10.62 18 12 18C13.38 18 14.5 16.88 14.5 15.5V5C14.5 2.79 12.71 1 10.5 1C8.29 1 6.5 2.79 6.5 5V17.5C6.5 20.54 8.96 23 12 23C15.04 23 17.5 20.54 17.5 17.5V6H16Z\" fill=\"currentColor\"/>","insert_link":"<path d=\"M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z\" fill=\"currentColor\"/>","arrow_back":"<path d=\"M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z\" fill=\"currentColor\"/>","expand_more":"<path d=\"M16.59 8.29498L12 12.875L7.41 8.29498L6 9.70498L12 15.705L18 9.70498L16.59 8.29498Z\" fill=\"currentColor\"/>","expand_less":"<path d=\"M12 8.29498L6 14.295L7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.29498Z\" fill=\"currentColor\"/>","chevron_right":"<path d=\"M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z\" fill=\"currentColor\"/>","chevron_left":"<path d=\"M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z\" fill=\"currentColor\"/>","add_box":"<path d=\"M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM11 17H13V13H17V11H13V7H11V11H7V13H11V17Z\" fill=\"currentColor\"/>","add":"<path d=\"M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z\" fill=\"currentColor\"/>","photo_camera":"<path d=\"M14.12 5L15.95 7H20V19H4V7H8.05L9.88 5H14.12ZM15 3H9L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3ZM12 10C13.65 10 15 11.35 15 13C15 14.65 13.65 16 12 16C10.35 16 9 14.65 9 13C9 11.35 10.35 10 12 10ZM12 8C9.24 8 7 10.24 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 10.24 14.76 8 12 8Z\" fill=\"currentColor\"/>","priority-level-high":"<path d=\"M7 11L12 8L17 11\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M7 16L12 13L17 16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>","priority-level-normal":"<path d=\"M8 9.5H16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M8 14.5H16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>","priority-level-low":"<path d=\"M17 13L12 16L7 13M17 8L12 11L7 8\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>","calendar_today":"<path d=\"M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z\" fill=\"currentColor\"/>","pending":"<path d=\"M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z\" fill=\"currentColor\"/><path d=\"M7 13.5C7.82843 13.5 8.5 12.8284 8.5 12C8.5 11.1716 7.82843 10.5 7 10.5C6.17157 10.5 5.5 11.1716 5.5 12C5.5 12.8284 6.17157 13.5 7 13.5Z\" fill=\"currentColor\"/><path d=\"M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z\" fill=\"currentColor\"/><path d=\"M17 13.5C17.8284 13.5 18.5 12.8284 18.5 12C18.5 11.1716 17.8284 10.5 17 10.5C16.1716 10.5 15.5 11.1716 15.5 12C15.5 12.8284 16.1716 13.5 17 13.5Z\" fill=\"currentColor\"/>","report":"<path d=\"M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3ZM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5H14.9L19 9.1V14.9Z\" fill=\"currentColor\"/><path d=\"M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z\" fill=\"currentColor\"/><path d=\"M11 7H13V14H11V7Z\" fill=\"currentColor\"/>","not_interested":"<path d=\"M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 10.15 4.63 8.45 5.69 7.1L16.9 18.31C15.55 19.37 13.85 20 12 20ZM18.31 16.9L7.1 5.69C8.45 4.63 10.15 4 12 4C16.42 4 20 7.58 20 12C20 13.85 19.37 15.55 18.31 16.9Z\" fill=\"currentColor\"/>","done":"<path d=\"M8.8002 15.9L4.6002 11.7L3.2002 13.1L8.8002 18.7L20.8002 6.69999L19.4002 5.29999L8.8002 15.9Z\" fill=\"currentColor\"/>","home":"<path d=\"M12 6.19L17 10.69V18.5H15V12.5H9V18.5H7V10.69L12 6.19ZM12 3.5L2 12.5H5V20.5H11V14.5H13V20.5H19V12.5H22L12 3.5Z\" fill=\"currentColor\"/>","Date in":"<path d=\"M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z\" fill=\"currentColor\"/><path d=\"M3 15.5H10M7 18L10 15.5L7 13\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>","Date out":"<path d=\"M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z\" fill=\"currentColor\"/><path d=\"M12 15.5H19M16 18L19 15.5L16 13\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>","ads_click":"<path d=\"M11.4551 17.74C8.27512 17.59 5.74512 14.97 5.74512 11.75C5.74512 8.44 8.43512 5.75 11.7451 5.75C14.9651 5.75 17.5851 8.28 17.7351 11.46L15.6351 10.83C15.2251 9.06 13.6351 7.75 11.7451 7.75C9.53512 7.75 7.74512 9.54 7.74512 11.75C7.74512 13.64 9.05512 15.23 10.8251 15.64L11.4551 17.74ZM21.7451 11.75C21.7451 12.05 21.7351 12.35 21.7051 12.65L19.7351 12.06C19.7451 11.96 19.7451 11.85 19.7451 11.75C19.7451 7.33 16.1651 3.75 11.7451 3.75C7.32512 3.75 3.74512 7.33 3.74512 11.75C3.74512 16.17 7.32512 19.75 11.7451 19.75C11.8451 19.75 11.9551 19.75 12.0551 19.74L12.6451 21.71C12.3451 21.74 12.0451 21.75 11.7451 21.75C6.22512 21.75 1.74512 17.27 1.74512 11.75C1.74512 6.23 6.22512 1.75 11.7451 1.75C17.2651 1.75 21.7451 6.23 21.7451 11.75ZM17.9751 16.01L21.7451 14.75L11.7451 11.75L14.7451 21.75L16.0051 17.98L20.2751 22.25L22.2551 20.27L17.9751 16.01Z\" fill=\"currentColor\"/>","join_full":"<path d=\"M12 17.74C13.6569 17.74 15 15.1701 15 12C15 8.82989 13.6569 6.26 12 6.26C10.3431 6.26 9 8.82989 9 12C9 15.1701 10.3431 17.74 12 17.74Z\" fill=\"currentColor\"/><path d=\"M7.5 12C7.5 11.03 7.73 7.84 10.53 5.5C9.75 5.19 8.9 5 8 5C4.14 5 1 8.14 1 12C1 15.86 4.14 19 8 19C8.9 19 9.75 18.81 10.53 18.5C7.73 16.16 7.5 12.97 7.5 12Z\" fill=\"currentColor\"/><path d=\"M16 5C15.1 5 14.25 5.19 13.47 5.5C16.27 7.84 16.5 11.03 16.5 12C16.5 12.97 16.27 16.16 13.47 18.5C14.25 18.81 15.1 19 16 19C19.86 19 23 15.86 23 12C23 8.14 19.86 5 16 5Z\" fill=\"currentColor\"/>","diamond":"<path d=\"M19 3H5L2 9L12 21L22 9L19 3ZM9.62 8L11.12 5H12.88L14.38 8H9.62ZM11 10V16.68L5.44 10H11ZM13 10H18.56L13 16.68V10ZM19.26 8H16.61L15.11 5H17.76L19.26 8ZM6.24 5H8.89L7.39 8H4.74L6.24 5Z\" fill=\"currentColor\"/>","edit":"<path d=\"M14.0585 9.02L14.9785 9.94L5.91854 19H4.99854V18.08L14.0585 9.02ZM17.6585 3C17.4085 3 17.1485 3.1 16.9585 3.29L15.1285 5.12L18.8785 8.87L20.7085 7.04C21.0985 6.65 21.0985 6.02 20.7085 5.63L18.3685 3.29C18.1685 3.09 17.9185 3 17.6585 3ZM14.0585 6.19L2.99854 17.25V21H6.74854L17.8085 9.94L14.0585 6.19Z\" fill=\"currentColor\"/>","remove":"<path d=\"M19 13H5V11H19V13Z\" fill=\"currentColor\"/>","close":"<path d=\"M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z\" fill=\"currentColor\"/>","delete":"<path d=\"M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z\" fill=\"currentColor\"/>","calendar_view_week":"<path d=\"M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM13 6H15.5V18H13V6ZM11 18H8.5V6H11V18ZM4 6H6.5V18H4V6ZM20 18H17.5V6H20V18Z\" fill=\"currentColor\"/>","calendar_view_month":"<path d=\"M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM8 11H4V6H8V11ZM14 11H10V6H14V11ZM20 11H16V6H20V11ZM8 18H4V13H8V18ZM14 18H10V13H14V18ZM20 18H16V13H20V18Z\" fill=\"currentColor\"/>","calendar_view_day":"<path d=\"M3 16.5H21V18.5H3V16.5ZM19 11.5V12.5H5V11.5H19ZM21 9.5H3V14.5H21V9.5ZM3 5.5H21V7.5H3V5.5Z\" fill=\"currentColor\"/>","menu":"<path d=\"M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z\" fill=\"currentColor\"/>","person_outline":"<path d=\"M12 5.9C13.16 5.9 14.1 6.84 14.1 8C14.1 9.16 13.16 10.1 12 10.1C10.84 10.1 9.9 9.16 9.9 8C9.9 6.84 10.84 5.9 12 5.9ZM12 14.9C14.97 14.9 18.1 16.36 18.1 17V18.1H5.9V17C5.9 16.36 9.03 14.9 12 14.9ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z\" fill=\"currentColor\"/>","business":"<path d=\"M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z\" fill=\"currentColor\"/>","local_parking":"<path d=\"M12.5 3H5.5V21H9.5V15H12.5C15.81 15 18.5 12.31 18.5 9C18.5 5.69 15.81 3 12.5 3ZM12.7 11H9.5V7H12.7C13.8 7 14.7 7.9 14.7 9C14.7 10.1 13.8 11 12.7 11Z\" fill=\"currentColor\"/>","directions_car":"<path d=\"M18.92 5.01C18.72 4.42 18.16 4 17.5 4H6.5C5.84 4 5.29 4.42 5.08 5.01L3 11V19C3 19.55 3.45 20 4 20H5C5.55 20 6 19.55 6 19V18H18V19C18 19.55 18.45 20 19 20H20C20.55 20 21 19.55 21 19V11L18.92 5.01ZM6.85 6H17.14L18.22 9.11H5.77L6.85 6ZM19 16H5V11H19V16Z\" fill=\"currentColor\"/><path d=\"M7.5 15C8.32843 15 9 14.3284 9 13.5C9 12.6716 8.32843 12 7.5 12C6.67157 12 6 12.6716 6 13.5C6 14.3284 6.67157 15 7.5 15Z\" fill=\"currentColor\"/><path d=\"M16.5 15C17.3284 15 18 14.3284 18 13.5C18 12.6716 17.3284 12 16.5 12C15.6716 12 15 12.6716 15 13.5C15 14.3284 15.6716 15 16.5 15Z\" fill=\"currentColor\"/>","entrance":"<rect x=\"3\" y=\"5\" width=\"10\" height=\"14\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M9.5 20.4121L3.5 19.4482V4.55078L9.5 3.58691V20.4121Z\" fill=\"currentColor\" stroke=\"currentColor\"/><path d=\"M18.8571 9L16 12L18.8571 15M16 12H21.5\" stroke=\"currentColor\" stroke-width=\"2\"/>","exit":"<rect x=\"4\" y=\"5\" width=\"10\" height=\"14\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10.5 20.4121L4.5 19.4482V4.55078L10.5 3.58691V20.4121Z\" fill=\"currentColor\" stroke=\"currentColor\"/><path d=\"M16.6429 9L19.5 12L16.6429 15M19.5 12H14\" stroke=\"currentColor\" stroke-width=\"2\"/>","tasks":"<rect x=\"4.5\" y=\"4\" width=\"12\" height=\"16\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10.5 14L13.5 17L20.5 9\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"7.5\" y1=\"8\" x2=\"13.5\" y2=\"8\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"7.5\" y1=\"11\" x2=\"13.5\" y2=\"11\" stroke=\"currentColor\" stroke-width=\"2\"/>","search":"<path d=\"M15.7549 14.255H14.9649L14.6849 13.985C15.6649 12.845 16.2549 11.365 16.2549 9.755C16.2549 6.165 13.3449 3.255 9.75488 3.255C6.16488 3.255 3.25488 6.165 3.25488 9.755C3.25488 13.345 6.16488 16.255 9.75488 16.255C11.3649 16.255 12.8449 15.665 13.9849 14.685L14.2549 14.965V15.755L19.2549 20.745L20.7449 19.255L15.7549 14.255ZM9.75488 14.255C7.26488 14.255 5.25488 12.245 5.25488 9.755C5.25488 7.26501 7.26488 5.255 9.75488 5.255C12.2449 5.255 14.2549 7.26501 14.2549 9.755C14.2549 12.245 12.2449 14.255 9.75488 14.255Z\" fill=\"currentColor\"/>","info":"<path d=\"M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z\" fill=\"currentColor\"/>","people_outline":"<path d=\"M9 13.75C6.66 13.75 2 14.92 2 17.25V19H16V17.25C16 14.92 11.34 13.75 9 13.75ZM4.34 17C5.18 16.42 7.21 15.75 9 15.75C10.79 15.75 12.82 16.42 13.66 17H4.34ZM9 12C10.93 12 12.5 10.43 12.5 8.5C12.5 6.57 10.93 5 9 5C7.07 5 5.5 6.57 5.5 8.5C5.5 10.43 7.07 12 9 12ZM9 7C9.83 7 10.5 7.67 10.5 8.5C10.5 9.33 9.83 10 9 10C8.17 10 7.5 9.33 7.5 8.5C7.5 7.67 8.17 7 9 7ZM16.04 13.81C17.2 14.65 18 15.77 18 17.25V19H22V17.25C22 15.23 18.5 14.08 16.04 13.81ZM15 12C16.93 12 18.5 10.43 18.5 8.5C18.5 6.57 16.93 5 15 5C14.46 5 13.96 5.13 13.5 5.35C14.13 6.24 14.5 7.33 14.5 8.5C14.5 9.67 14.13 10.76 13.5 11.65C13.96 11.87 14.46 12 15 12Z\" fill=\"currentColor\"/>","admin_panel_settings":"<path d=\"M16 15.62C16.6186 15.62 17.12 15.1186 17.12 14.5C17.12 13.8814 16.6186 13.38 16 13.38C15.3814 13.38 14.88 13.8814 14.88 14.5C14.88 15.1186 15.3814 15.62 16 15.62Z\" fill=\"currentColor\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16 16.5C15.27 16.5 13.81 16.86 13.76 17.58C14.26 18.29 15.08 18.75 16 18.75C16.92 18.75 17.74 18.29 18.24 17.58C18.19 16.86 16.73 16.5 16 16.5Z\" fill=\"currentColor\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M17 10.09V5.27L9.5 2L2 5.27V10.18C2 14.72 5.2 18.97 9.5 20C10.05 19.87 10.58 19.68 11.1 19.45C12.18 20.99 13.97 22 16 22C19.31 22 22 19.31 22 16C22 13.03 19.84 10.57 17 10.09ZM10 16C10 16.56 10.08 17.11 10.23 17.62C9.99 17.73 9.75 17.84 9.5 17.92C6.33 16.92 4 13.68 4 10.18V6.58L9.5 4.18L15 6.58V10.09C12.16 10.57 10 13.03 10 16ZM16 20C13.79 20 12 18.21 12 16C12 13.79 13.79 12 16 12C18.21 12 20 13.79 20 16C20 18.21 18.21 20 16 20Z\" fill=\"currentColor\"/>","more_horiz":"<path d=\"M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z\" fill=\"currentColor\"/>","arrow_upward":"<path d=\"M4 12L5.41 13.41L11 7.83V20H13V7.83L18.58 13.42L20 12L12 4L4 12Z\" fill=\"currentColor\"/>","arrow_forward":"<path d=\"M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z\" fill=\"currentColor\"/>","arrow_downward":"<path d=\"M20 12L18.59 10.59L13 16.17V4H11V16.17L5.42 10.58L4 12L12 20L20 12Z\" fill=\"currentColor\"/>","flag":"<path d=\"M11.86 5.5L12.26 7.5H17.5V13.5H14.14L13.74 11.5H6.5V5.5H11.86ZM13.5 3.5H4.5V20.5H6.5V13.5H12.1L12.5 15.5H19.5V5.5H13.9L13.5 3.5Z\" fill=\"currentColor\"/>","notifications":"<path d=\"M12 21.75C13.1 21.75 14 20.85 14 19.75H10C10 20.85 10.9 21.75 12 21.75ZM18 15.75V10.75C18 7.68 16.37 5.11 13.5 4.43V3.75C13.5 2.92 12.83 2.25 12 2.25C11.17 2.25 10.5 2.92 10.5 3.75V4.43C7.64 5.11 6 7.67 6 10.75V15.75L4 17.75V18.75H20V17.75L18 15.75ZM16 16.75H8V10.75C8 8.27 9.51 6.25 12 6.25C14.49 6.25 16 8.27 16 10.75V16.75Z\" fill=\"currentColor\"/>","imagesearch_roller":"<path d=\"M21 6.5V2.5C21 1.95 20.55 1.5 20 1.5H8C7.45 1.5 7 1.95 7 2.5V3.5H5C3.9 3.5 3 4.4 3 5.5V9.5C3 10.6 3.9 11.5 5 11.5H13V14.5H12C11.45 14.5 11 14.95 11 15.5V21.5C11 22.05 11.45 22.5 12 22.5H16C16.55 22.5 17 22.05 17 21.5V15.5C17 14.95 16.55 14.5 16 14.5H15V11.5C15 10.4 14.1 9.5 13 9.5H5V5.5H7V6.5C7 7.05 7.45 7.5 8 7.5H20C20.55 7.5 21 7.05 21 6.5ZM9 3.5H19V5.5H9V3.5ZM15 20.5H13V16.5H15V20.5Z\" fill=\"currentColor\"/>","Certification":"<path d=\"M21.0002 4.11C21.0002 4.11 16.2002 3.05 12.0302 2C9.02617 2.73992 6.02871 3.52157 2.99023 4.11V13.34C2.99023 17.18 7.50023 20.04 12.0102 22.01C17.0002 20 21.0002 18.4626 21.0002 13.34V4.11Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M7 11L11.5 14.5L17.5 8\" stroke=\"currentColor\" stroke-width=\"2\"/>","headset_mic":"<path d=\"M19 14V18H17V14H19ZM7 14V18H6C5.45 18 5 17.55 5 17V14H7ZM12 1C7.03 1 3 5.03 3 10V17C3 18.66 4.34 20 6 20H9V12H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V12H15V20H19V21H12V23H18C19.66 23 21 21.66 21 20V10C21 5.03 16.97 1 12 1Z\" fill=\"currentColor\"/>","history":"<path d=\"M13.5 3C8.53 3 4.5 7.03 4.5 12H1.5L5.39 15.89L5.46 16.03L9.5 12H6.5C6.5 8.13 9.63 5 13.5 5C17.37 5 20.5 8.13 20.5 12C20.5 15.87 17.37 19 13.5 19C11.57 19 9.82 18.21 8.56 16.94L7.14 18.36C8.77 19.99 11.01 21 13.5 21C18.47 21 22.5 16.97 22.5 12C22.5 7.03 18.47 3 13.5 3ZM12.5 8V13L16.75 15.52L17.52 14.24L14 12.15V8H12.5Z\" fill=\"currentColor\"/>","screenshot_monitor":"<path d=\"M20 3H4C2.89 3 2 3.89 2 5V17C2 18.1 2.89 19 4 19H8V21H16V19H20C21.1 19 22 18.1 22 17V5C22 3.89 21.1 3 20 3ZM20 17H4V5H20V17Z\" fill=\"currentColor\"/><path d=\"M6.5 7.5H9V6H5V10H6.5V7.5Z\" fill=\"currentColor\"/><path d=\"M19 12H17.5V14.5H15V16H19V12Z\" fill=\"currentColor\"/>","Whiteboard":"<path d=\"M7 11.9776C7 11.9776 9.13571 8.97022 10.2357 9.00022C12.0286 9.05272 12.0286 15 14 15C15.5357 15 17 12.0526 17 12.0526\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\" stroke-linecap=\"round\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" stroke=\"currentColor\" stroke-width=\"2\"/>","Record":"<path d=\"M4 7L4 17\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M8 4L8 20\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M16 6V18\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M12 8V16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M20 8V16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>","filter_list":"<path d=\"M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z\" fill=\"currentColor\"/>","pen":"<path d=\"M12 20.785V13.785\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/><path d=\"M8.99975 6.78497L6.98975 15.575C6.98975 15.575 9.99975 17.785 11.9997 20.785C13.9997 17.785 16.9897 15.575 16.9897 15.575L14.9997 6.78497H8.99975Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/><path d=\"M12 15.785C13.1046 15.785 14 14.8895 14 13.785C14 12.6804 13.1046 11.785 12 11.785C10.8954 11.785 10 12.6804 10 13.785C10 14.8895 10.8954 15.785 12 15.785Z\" fill=\"currentColor\"/><path d=\"M5 1.78497L7 6.78497H17L19 1.78497\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/>","eraser":"<path d=\"M18.4126 9.03006L14.1699 4.78741L8.21608 10.7413L12.4587 14.9839L18.4126 9.03006Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/><path d=\"M12.4565 14.9846L8.21387 10.742L5.56929 13.3866L9.81193 17.6292L12.4565 14.9846Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/><path d=\"M2 19.625H22\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/>","line-weight":"<path d=\"M3 4.875H21\" stroke=\"currentColor\" stroke-width=\"0.5\" stroke-miterlimit=\"10\"/><path d=\"M3 8.875H21\" stroke=\"currentColor\" stroke-miterlimit=\"10\"/><path d=\"M3 12.875H21\" stroke=\"currentColor\" stroke-width=\"2\" stroke-miterlimit=\"10\"/><path d=\"M3 17.875H21\" stroke=\"currentColor\" stroke-width=\"3\" stroke-miterlimit=\"10\"/>","play_circle_outline":"<path d=\"M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z\" fill=\"currentColor\"/>","pause_circle":"<path d=\"M9 16H11V8H9V16ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 16H15V8H13V16Z\" fill=\"currentColor\"/>","volume_off":"<path d=\"M4.34018 2.935L2.93018 4.345L7.29018 8.705L7.00018 9.005H3.00018V15.005H7.00018L12.0002 20.005V13.415L16.1802 17.595C15.5302 18.085 14.8002 18.475 14.0002 18.705V20.765C15.3402 20.465 16.5702 19.845 17.6102 19.015L19.6602 21.065L21.0702 19.655L4.34018 2.935ZM10.0002 15.175L7.83018 13.005H5.00018V11.005H7.83018L8.71018 10.125L10.0002 11.415V15.175ZM19.0002 12.005C19.0002 12.825 18.8502 13.615 18.5902 14.345L20.1202 15.875C20.6802 14.705 21.0002 13.395 21.0002 12.005C21.0002 7.725 18.0102 4.145 14.0002 3.235V5.295C16.8902 6.155 19.0002 8.835 19.0002 12.005ZM12.0002 4.005L10.1202 5.885L12.0002 7.765V4.005ZM16.5002 12.005C16.5002 10.235 15.4802 8.715 14.0002 7.975V9.765L16.4802 12.245C16.4902 12.165 16.5002 12.085 16.5002 12.005Z\" fill=\"currentColor\"/>","volume_up":"<path d=\"M3 8.99998V15H7L12 20V3.99998L7 8.99998H3ZM10 8.82998V15.17L7.83 13H5V11H7.83L10 8.82998ZM16.5 12C16.5 10.23 15.48 8.70998 14 7.96998V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.22998V5.28998C16.89 6.14998 19 8.82998 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.71998 18.01 4.13998 14 3.22998Z\" fill=\"currentColor\"/>","mic_none":"<path d=\"M12 14.5C13.66 14.5 15 13.16 15 11.5V5.5C15 3.84 13.66 2.5 12 2.5C10.34 2.5 9 3.84 9 5.5V11.5C9 13.16 10.34 14.5 12 14.5ZM11 5.5C11 4.95 11.45 4.5 12 4.5C12.55 4.5 13 4.95 13 5.5V11.5C13 12.05 12.55 12.5 12 12.5C11.45 12.5 11 12.05 11 11.5V5.5ZM17 11.5C17 14.26 14.76 16.5 12 16.5C9.24 16.5 7 14.26 7 11.5H5C5 15.03 7.61 17.93 11 18.42V21.5H13V18.42C16.39 17.93 19 15.03 19 11.5H17Z\" fill=\"currentColor\"/>","schedule":"<path d=\"M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z\" fill=\"currentColor\"/>","summarize":"<path d=\"M15 3H5C3.9 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 4.99 21H19C20.1 21 21 20.1 21 19V9L15 3ZM5 19V5H14V10H19V19H5ZM9 8C9 8.55 8.55 9 8 9C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7C8.55 7 9 7.45 9 8ZM9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12ZM9 16C9 16.55 8.55 17 8 17C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15C8.55 15 9 15.45 9 16Z\" fill=\"currentColor\"/>","receipt_long":"<path d=\"M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2V16H3V19C3 20.66 4.34 22 6 22H18C19.66 22 21 20.66 21 19V2L19.5 3.5ZM15 20H6C5.45 20 5 19.55 5 19V18H15V20ZM19 19C19 19.55 18.55 20 18 20C17.45 20 17 19.55 17 19V16H8V5H19V19Z\" fill=\"currentColor\"/><path d=\"M15 7H9V9H15V7Z\" fill=\"currentColor\"/><path d=\"M18 7H16V9H18V7Z\" fill=\"currentColor\"/><path d=\"M15 10H9V12H15V10Z\" fill=\"currentColor\"/><path d=\"M18 10H16V12H18V10Z\" fill=\"currentColor\"/>","file_download":"<path d=\"M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z\" fill=\"currentColor\"/>","key":"<path d=\"M21 10H12.65C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H13L15 16L17 14L19 16L23 11.96L21 10ZM7 15C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9C8.65 9 10 10.35 10 12C10 13.65 8.65 15 7 15Z\" fill=\"currentColor\"/>","text_snippet":"<path d=\"M14.17 5L19 9.83V19H5V5H14.17ZM14.17 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9.83C21 9.3 20.79 8.79 20.41 8.42L15.58 3.59C15.21 3.21 14.7 3 14.17 3ZM7 15H17V17H7V15ZM7 11H17V13H7V11ZM7 7H14V9H7V7Z\" fill=\"currentColor\"/>","article":"<path d=\"M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z\" fill=\"currentColor\"/><path d=\"M14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z\" fill=\"currentColor\"/>","description":"<path d=\"M8 16H16V18H8V16ZM8 12H16V14H8V12ZM14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z\" fill=\"currentColor\"/>","sync_alt":"<path d=\"M7.41 13.41L6 12L2 16L6 20L7.41 18.59L5.83 17H21V15H5.83L7.41 13.41Z\" fill=\"currentColor\"/><path d=\"M16.59 10.59L18 12L22 8L18 4L16.59 5.41L18.17 7H3V9H18.17L16.59 10.59Z\" fill=\"currentColor\"/>","sync":"<path d=\"M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z\" fill=\"currentColor\"/>","change_circle":"<path d=\"M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.17 14.76L15.07 13.66C15.78 12.33 15.6 10.65 14.48 9.53C13.79 8.84 12.9 8.5 12 8.5C11.97 8.5 11.94 8.51 11.91 8.51L13 9.6L11.94 10.66L9.11 7.83L11.94 5L13 6.06L12.04 7.02C13.31 7.03 14.57 7.5 15.54 8.46C17.24 10.17 17.45 12.82 16.17 14.76ZM14.89 16.17L12.06 19L11 17.94L11.95 16.99C10.69 16.98 9.43 16.49 8.47 15.53C6.76 13.82 6.55 11.18 7.83 9.24L8.93 10.34C8.22 11.67 8.4 13.35 9.52 14.47C10.22 15.17 11.15 15.51 12.08 15.48L11 14.4L12.06 13.34L14.89 16.17Z\" fill=\"currentColor\"/>","data_object":"<path d=\"M4 7V9C4 9.55 3.55 10 3 10H2V14H3C3.55 14 4 14.45 4 15V17C4 18.65 5.35 20 7 20H10V18H7C6.45 18 6 17.55 6 17V15C6 13.7 5.16 12.58 4 12.17V11.83C5.16 11.42 6 10.3 6 9V7C6 6.45 6.45 6 7 6H10V4H7C5.35 4 4 5.35 4 7Z\" fill=\"currentColor\"/><path d=\"M21 10C20.45 10 20 9.55 20 9V7C20 5.35 18.65 4 17 4H14V6H17C17.55 6 18 6.45 18 7V9C18 10.3 18.84 11.42 20 11.83V12.17C18.84 12.58 18 13.69 18 15V17C18 17.55 17.55 18 17 18H14V20H17C18.65 20 20 18.65 20 17V15C20 14.45 20.45 14 21 14H22V10H21Z\" fill=\"currentColor\"/>","assignment":"<path d=\"M7 16H14V18H7V16ZM7 12H17V14H7V12ZM7 8H17V10H7V8ZM19 4H14.82C14.4 2.84 13.3 2 12 2C10.7 2 9.6 2.84 9.18 4H5C4.86 4 4.73 4.01 4.6 4.04C4.21 4.12 3.86 4.32 3.59 4.59C3.41 4.77 3.26 4.99 3.16 5.23C3.06 5.46 3 5.72 3 6V20C3 20.27 3.06 20.54 3.16 20.78C3.26 21.02 3.41 21.23 3.59 21.42C3.86 21.69 4.21 21.89 4.6 21.97C4.73 21.99 4.86 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM12 3.75C12.41 3.75 12.75 4.09 12.75 4.5C12.75 4.91 12.41 5.25 12 5.25C11.59 5.25 11.25 4.91 11.25 4.5C11.25 4.09 11.59 3.75 12 3.75ZM19 20H5V6H19V20Z\" fill=\"currentColor\"/>","login":"<path d=\"M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z\" fill=\"currentColor\"/>","logout":"<path d=\"M17 8L15.59 9.41L17.17 11H9V13H17.17L15.59 14.58L17 16L21 12L17 8ZM5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5Z\" fill=\"currentColor\"/>","emoji_events":"<path d=\"M19 5H17V3H7V5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.63 7.39 12.94C8.02 14.44 9.37 15.57 11 15.9V19H7V21H17V19H13V15.9C14.63 15.57 15.98 14.44 16.61 12.94C19.08 12.63 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V10.82C5.84 10.4 5 9.3 5 8ZM12 14C10.35 14 9 12.65 9 11V5H15V11C15 12.65 13.65 14 12 14ZM19 8C19 9.3 18.16 10.4 17 10.82V7H19V8Z\" fill=\"currentColor\"/>","settings":"<path d=\"M19.4323 12.98C19.4723 12.66 19.5023 12.34 19.5023 12C19.5023 11.66 19.4723 11.34 19.4323 11.02L21.5423 9.37C21.7323 9.22 21.7823 8.95 21.6623 8.73L19.6623 5.27C19.5723 5.11 19.4023 5.02 19.2223 5.02C19.1623 5.02 19.1023 5.03 19.0523 5.05L16.5623 6.05C16.0423 5.65 15.4823 5.32 14.8723 5.07L14.4923 2.42C14.4623 2.18 14.2523 2 14.0023 2H10.0023C9.75228 2 9.54228 2.18 9.51228 2.42L9.13228 5.07C8.52228 5.32 7.96228 5.66 7.44228 6.05L4.95228 5.05C4.89228 5.03 4.83228 5.02 4.77228 5.02C4.60228 5.02 4.43228 5.11 4.34228 5.27L2.34228 8.73C2.21228 8.95 2.27228 9.22 2.46228 9.37L4.57228 11.02C4.53228 11.34 4.50228 11.67 4.50228 12C4.50228 12.33 4.53228 12.66 4.57228 12.98L2.46228 14.63C2.27228 14.78 2.22228 15.05 2.34228 15.27L4.34228 18.73C4.43228 18.89 4.60228 18.98 4.78228 18.98C4.84228 18.98 4.90228 18.97 4.95228 18.95L7.44228 17.95C7.96228 18.35 8.52228 18.68 9.13228 18.93L9.51228 21.58C9.54228 21.82 9.75228 22 10.0023 22H14.0023C14.2523 22 14.4623 21.82 14.4923 21.58L14.8723 18.93C15.4823 18.68 16.0423 18.34 16.5623 17.95L19.0523 18.95C19.1123 18.97 19.1723 18.98 19.2323 18.98C19.4023 18.98 19.5723 18.89 19.6623 18.73L21.6623 15.27C21.7823 15.05 21.7323 14.78 21.5423 14.63L19.4323 12.98ZM17.4523 11.27C17.4923 11.58 17.5023 11.79 17.5023 12C17.5023 12.21 17.4823 12.43 17.4523 12.73L17.3123 13.86L18.2023 14.56L19.2823 15.4L18.5823 16.61L17.3123 16.1L16.2723 15.68L15.3723 16.36C14.9423 16.68 14.5323 16.92 14.1223 17.09L13.0623 17.52L12.9023 18.65L12.7023 20H11.3023L10.9523 17.52L9.89228 17.09C9.46228 16.91 9.06228 16.68 8.66228 16.38L7.75228 15.68L6.69228 16.11L5.42228 16.62L4.72228 15.41L5.80228 14.57L6.69228 13.87L6.55228 12.74C6.52228 12.43 6.50228 12.2 6.50228 12C6.50228 11.8 6.52228 11.57 6.55228 11.27L6.69228 10.14L5.80228 9.44L4.72228 8.6L5.42228 7.39L6.69228 7.9L7.73228 8.32L8.63228 7.64C9.06228 7.32 9.47228 7.08 9.88228 6.91L10.9423 6.48L11.1023 5.35L11.3023 4H12.6923L13.0423 6.48L14.1023 6.91C14.5323 7.09 14.9323 7.32 15.3323 7.62L16.2423 8.32L17.3023 7.89L18.5723 7.38L19.2723 8.59L18.2023 9.44L17.3123 10.14L17.4523 11.27ZM12.0023 8C9.79228 8 8.00228 9.79 8.00228 12C8.00228 14.21 9.79228 16 12.0023 16C14.2123 16 16.0023 14.21 16.0023 12C16.0023 9.79 14.2123 8 12.0023 8ZM12.0023 14C10.9023 14 10.0023 13.1 10.0023 12C10.0023 10.9 10.9023 10 12.0023 10C13.1023 10 14.0023 10.9 14.0023 12C14.0023 13.1 13.1023 14 12.0023 14Z\" fill=\"currentColor\"/>","airline_seat_individual_suite":"<path d=\"M7 14C8.66 14 10 12.66 10 11C10 9.34 8.66 8 7 8C5.34 8 4 9.34 4 11C4 12.66 5.34 14 7 14ZM7 10C7.55 10 8 10.45 8 11C8 11.55 7.55 12 7 12C6.45 12 6 11.55 6 11C6 10.45 6.45 10 7 10ZM19 7H11V15H3V7H1V17H23V11C23 8.79 21.21 7 19 7ZM21 15H13V9H19C20.1 9 21 9.9 21 11V15Z\" fill=\"currentColor\"/>","flight":"<path d=\"M21.5 16V14L13.5 9V3.5C13.5 2.67 12.83 2 12 2C11.17 2 10.5 2.67 10.5 3.5V9L2.5 14V16L10.5 13.5V19L8.5 20.5V22L12 21L15.5 22V20.5L13.5 19V13.5L21.5 16Z\" fill=\"currentColor\"/>","directions_boat":"<path d=\"M13.0014 3V4H11.0014V3H13.0014ZM12.0014 10.11L17.3814 11.88L19.7714 12.66L18.6514 16.63C18.1114 16.33 17.7114 15.92 17.5114 15.69L16.0014 13.96L14.4914 15.68C14.1514 16.08 13.2114 17 12.0014 17C10.7914 17 9.85135 16.08 9.51135 15.68L8.00135 13.96L6.49135 15.68C6.29135 15.91 5.89135 16.31 5.35135 16.61L4.22135 12.65L6.62135 11.86L12.0014 10.11ZM15.0014 1H9.00135V4H6.00135C4.90135 4 4.00135 4.9 4.00135 6V10.62L2.71135 11.04C2.45135 11.12 2.23135 11.3 2.11135 11.54C1.99135 11.78 1.96135 12.06 2.05135 12.32L3.95135 19H4.00135C5.60135 19 7.02135 18.12 8.00135 17C8.98135 18.12 10.4014 19 12.0014 19C13.6014 19 15.0214 18.12 16.0014 17C16.9814 18.12 18.4014 19 20.0014 19H20.0514L21.9414 12.32C22.0214 12.06 22.0014 11.78 21.8814 11.54C21.7614 11.3 21.5414 11.12 21.2814 11.04L20.0014 10.62V6C20.0014 4.9 19.1014 4 18.0014 4H15.0014V1ZM6.00135 9.97V6H18.0014V9.97L12.0014 8L6.00135 9.97ZM16.0014 19.68C14.7814 20.53 13.3914 20.96 12.0014 20.96C10.6114 20.96 9.22135 20.53 8.00135 19.68C6.78135 20.53 5.39135 21 4.00135 21H2.00135V23H4.00135C5.38135 23 6.74135 22.65 8.00135 22.01C9.26135 22.65 10.6314 22.98 12.0014 22.98C13.3714 22.98 14.7414 22.66 16.0014 22.01C17.2614 22.66 18.6214 23 20.0014 23H22.0014V21H20.0014C18.6114 21 17.2214 20.53 16.0014 19.68Z\" fill=\"currentColor\"/>","sort":"<path d=\"M3 18H9V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z\" fill=\"currentColor\"/>","chat":"<path d=\"M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z\" fill=\"currentColor\"/>","mail_outline":"<path d=\"M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z\" fill=\"currentColor\"/>","sent":"<path d=\"M3 5L6.72414 12H21L3 5Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/><path d=\"M3 19L6.72414 12H21L3 19Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/>","phone":"<path d=\"M6.54 5C6.6 5.89 6.75 6.76 6.99 7.59L5.79 8.79C5.38 7.59 5.12 6.32 5.03 5H6.54ZM16.4 17.02C17.25 17.26 18.12 17.41 19 17.47V18.96C17.68 18.87 16.41 18.61 15.2 18.21L16.4 17.02ZM7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.51C21 15.96 20.55 15.51 20 15.51C18.76 15.51 17.55 15.31 16.43 14.94C16.33 14.9 16.22 14.89 16.12 14.89C15.86 14.89 15.61 14.99 15.41 15.18L13.21 17.38C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.59C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3Z\" fill=\"currentColor\"/>","language":"<path d=\"M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.35 18.92 8ZM12 4.04C12.83 5.24 13.48 6.57 13.91 8H10.09C10.52 6.57 11.17 5.24 12 4.04ZM4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14H4.26ZM5.08 16H8.03C8.35 17.25 8.81 18.45 9.41 19.56C7.57 18.93 6.04 17.66 5.08 16ZM8.03 8H5.08C6.04 6.34 7.57 5.07 9.41 4.44C8.81 5.55 8.35 6.75 8.03 8ZM12 19.96C11.17 18.76 10.52 17.43 10.09 16H13.91C13.48 17.43 12.83 18.76 12 19.96ZM14.34 14H9.66C9.57 13.34 9.5 12.68 9.5 12C9.5 11.32 9.57 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34 14ZM14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56ZM16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14H16.36Z\" fill=\"currentColor\"/>","on-off":"<path d=\"M5.7 6.5C4.03377 8.08819 3 10.3013 3 12.7493C3 17.5822 7.02944 21.5 12 21.5C16.9706 21.5 21 17.5822 21 12.7493C21 10.3013 19.9662 8.08819 18.3 6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"square\"/><path d=\"M12 13.5L12 2.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"square\"/>","dashboard":"<path d=\"M19.3636 12.8182C19.3636 17.3369 15.7005 21 11.1818 21C6.66312 21 3 17.3369 3 12.8182C3 8.29948 6.66312 4.63635 11.1818 4.63635C11.1818 6.68181 11.1818 11.1818 11.1818 12.8182C11.5909 12.8182 16.0909 12.8182 19.3636 12.8182Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M14.4545 3C18.0695 3 21 5.9305 21 9.54545H14.4545V3Z\" stroke=\"currentColor\" stroke-width=\"2\"/>","credit-card":"<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M20 19C21.1046 19 22 18.1046 22 17V11L2 11V17C2 18.1046 2.89543 19 4 19L20 19ZM2 9L22 9L22 7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V9Z\" fill=\"currentColor\"/>","steps":"<path d=\"M11.4 5.52499C11.42 8.74499 9.73002 7.78499 10.69 12.815C11.02 14.565 10.79 16.705 9.01002 16.915C5.06002 17.375 4.67002 12.295 4.47002 9.94499C3.98002 4.31499 4.32002 2.19499 7.46002 1.91499C10.16 1.67499 11.38 3.30499 11.4 5.52499Z\" fill=\"currentColor\"/><path d=\"M12.5699 10.765C12.6299 13.985 14.2999 12.985 13.4599 18.035C13.1699 19.795 13.4599 21.925 15.2499 22.085C19.1999 22.445 19.4599 17.345 19.5999 14.995C19.9399 9.355 19.5499 7.25499 16.4099 7.04499C13.6999 6.87499 12.5199 8.53499 12.5699 10.755V10.765Z\" fill=\"currentColor\"/>","save":"<path d=\"M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z\" fill=\"currentColor\"/>","linked_services":"<path d=\"M19 9C18.05 9 17.225 8.71667 16.525 8.15C15.825 7.58333 15.3583 6.86667 15.125 6H8.85C8.66667 6.7 8.32083 7.30417 7.8125 7.8125C7.30417 8.32083 6.7 8.66667 6 8.85V15.125C6.86667 15.3583 7.58333 15.825 8.15 16.525C8.71667 17.225 9 18.05 9 19C9 20.1 8.60833 21.0417 7.825 21.825C7.04167 22.6083 6.1 23 5 23C3.9 23 2.95833 22.6083 2.175 21.825C1.39167 21.0417 1 20.1 1 19C1 18.05 1.28333 17.225 1.85 16.525C2.41667 15.825 3.13333 15.3583 4 15.125V8.85C3.13333 8.61667 2.41667 8.15 1.85 7.45C1.28333 6.75 1 5.93333 1 5C1 3.9 1.39167 2.95833 2.175 2.175C2.95833 1.39167 3.9 1 5 1C5.93333 1 6.75 1.28333 7.45 1.85C8.15 2.41667 8.61667 3.13333 8.85 4H15.125C15.3583 3.13333 15.825 2.41667 16.525 1.85C17.225 1.28333 18.05 1 19 1C20.1 1 21.0417 1.39167 21.825 2.175C22.6083 2.95833 23 3.9 23 5C23 6.1 22.6083 7.04167 21.825 7.825C21.0417 8.60833 20.1 9 19 9ZM5 21C5.55 21 6.02083 20.8 6.4125 20.4C6.80417 20 7 19.5333 7 19C7 18.45 6.80417 17.9792 6.4125 17.5875C6.02083 17.1958 5.55 17 5 17C4.46667 17 4 17.1958 3.6 17.5875C3.2 17.9792 3 18.45 3 19C3 19.5333 3.2 20 3.6 20.4C4 20.8 4.46667 21 5 21ZM5 7C5.55 7 6.02083 6.80417 6.4125 6.4125C6.80417 6.02083 7 5.55 7 5C7 4.45 6.80417 3.97917 6.4125 3.5875C6.02083 3.19583 5.55 3 5 3C4.46667 3 4 3.19583 3.6 3.5875C3.2 3.97917 3 4.45 3 5C3 5.55 3.2 6.02083 3.6 6.4125C4 6.80417 4.46667 7 5 7ZM19 23C17.9 23 16.9583 22.6083 16.175 21.825C15.3917 21.0417 15 20.1 15 19C15 17.9 15.3917 16.9583 16.175 16.175C16.9583 15.3917 17.9 15 19 15C20.1 15 21.0417 15.3917 21.825 16.175C22.6083 16.9583 23 17.9 23 19C23 20.1 22.6083 21.0417 21.825 21.825C21.0417 22.6083 20.1 23 19 23ZM19 21C19.55 21 20.0208 20.8 20.4125 20.4C20.8042 20 21 19.5333 21 19C21 18.45 20.8042 17.9792 20.4125 17.5875C20.0208 17.1958 19.55 17 19 17C18.45 17 17.9792 17.1958 17.5875 17.5875C17.1958 17.9792 17 18.45 17 19C17 19.5333 17.1958 20 17.5875 20.4C17.9792 20.8 18.45 21 19 21ZM19 7C19.55 7 20.0208 6.80417 20.4125 6.4125C20.8042 6.02083 21 5.55 21 5C21 4.45 20.8042 3.97917 20.4125 3.5875C20.0208 3.19583 19.55 3 19 3C18.45 3 17.9792 3.19583 17.5875 3.5875C17.1958 3.97917 17 4.45 17 5C17 5.55 17.1958 6.02083 17.5875 6.4125C17.9792 6.80417 18.45 7 19 7Z\" fill=\"currentColor\"/>","side_navigation":"<path d=\"M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM12 19H19V5H12V19Z\" fill=\"currentColor\"/>","tools":"<path d=\"M18.9 21L13.425 15.525L15.525 13.425L21 18.9L18.9 21ZM5.1 21L3 18.9L9.9 12L8.2 10.3L7.5 11L6.225 9.72498V11.775L5.525 12.475L2.5 9.44998L3.2 8.74998H5.25L4 7.49998L7.55 3.94998C7.88333 3.61664 8.24167 3.37498 8.625 3.22498C9.00833 3.07498 9.4 2.99998 9.8 2.99998C10.2 2.99998 10.5917 3.07498 10.975 3.22498C11.3583 3.37498 11.7167 3.61664 12.05 3.94998L9.75 6.24998L11 7.49998L10.3 8.19998L12 9.89998L14.25 7.64998C14.1833 7.46664 14.1292 7.27498 14.0875 7.07498C14.0458 6.87498 14.025 6.67498 14.025 6.47498C14.025 5.49164 14.3625 4.66248 15.0375 3.98748C15.7125 3.31248 16.5417 2.97498 17.525 2.97498C17.775 2.97498 18.0125 2.99998 18.2375 3.04998C18.4625 3.09998 18.6917 3.17498 18.925 3.27498L16.45 5.74998L18.25 7.54998L20.725 5.07498C20.8417 5.30831 20.9208 5.53748 20.9625 5.76248C21.0042 5.98748 21.025 6.22498 21.025 6.47498C21.025 7.45831 20.6875 8.28748 20.0125 8.96248C19.3375 9.63748 18.5083 9.97498 17.525 9.97498C17.325 9.97498 17.125 9.95831 16.925 9.92498C16.725 9.89164 16.5333 9.83331 16.35 9.74998L5.1 21Z\" fill=\"currentColor\"/>","files":"<path d=\"M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6H10L12 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM5.825 13H11V7.825L5.825 13ZM4 12L8 8H4V12ZM4 15V18H20V6H13V13C13 13.55 12.8042 14.0208 12.4125 14.4125C12.0208 14.8042 11.55 15 11 15H4Z\" fill=\"currentColor\"/>","campaign":"<path d=\"M18 13V11H22V13H18ZM19.2 20L16 17.6L17.2 16L20.4 18.4L19.2 20ZM17.2 8L16 6.4L19.2 4L20.4 5.6L17.2 8ZM5 19V15H4C3.45 15 2.97917 14.8042 2.5875 14.4125C2.19583 14.0208 2 13.55 2 13V11C2 10.45 2.19583 9.97917 2.5875 9.5875C2.97917 9.19583 3.45 9 4 9H8L13 6V18L8 15H7V19H5ZM11 14.45V9.55L8.55 11H4V13H8.55L11 14.45ZM14 15.35V8.65C14.45 9.05 14.8125 9.5375 15.0875 10.1125C15.3625 10.6875 15.5 11.3167 15.5 12C15.5 12.6833 15.3625 13.3125 15.0875 13.8875C14.8125 14.4625 14.45 14.95 14 15.35Z\" fill=\"currentColor\"/>","open_in_new":"<path d=\"M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H12V5H5V19H19V12H21V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM9.7 15.7L8.3 14.3L17.6 5H14V3H21V10H19V6.4L9.7 15.7Z\" fill=\"currentColor\"/>","dark_mode":"<path d=\"M12 21C9.5 21 7.375 20.125 5.625 18.375C3.875 16.625 3 14.5 3 12C3 9.5 3.875 7.375 5.625 5.625C7.375 3.875 9.5 3 12 3C12.2333 3 12.4625 3.00833 12.6875 3.025C12.9125 3.04167 13.1333 3.06667 13.35 3.1C12.6667 3.58333 12.1208 4.2125 11.7125 4.9875C11.3042 5.7625 11.1 6.6 11.1 7.5C11.1 9 11.625 10.275 12.675 11.325C13.725 12.375 15 12.9 16.5 12.9C17.4167 12.9 18.2583 12.6958 19.025 12.2875C19.7917 11.8792 20.4167 11.3333 20.9 10.65C20.9333 10.8667 20.9583 11.0875 20.975 11.3125C20.9917 11.5375 21 11.7667 21 12C21 14.5 20.125 16.625 18.375 18.375C16.625 20.125 14.5 21 12 21ZM12 19C13.4667 19 14.7833 18.5958 15.95 17.7875C17.1167 16.9792 17.9667 15.925 18.5 14.625C18.1667 14.7083 17.8333 14.775 17.5 14.825C17.1667 14.875 16.8333 14.9 16.5 14.9C14.45 14.9 12.7042 14.1792 11.2625 12.7375C9.82083 11.2958 9.1 9.55 9.1 7.5C9.1 7.16667 9.125 6.83333 9.175 6.5C9.225 6.16667 9.29167 5.83333 9.375 5.5C8.075 6.03333 7.02083 6.88333 6.2125 8.05C5.40417 9.21667 5 10.5333 5 12C5 13.9333 5.68333 15.5833 7.05 16.95C8.41667 18.3167 10.0667 19 12 19Z\" fill=\"currentColor\"/>","headphones":"<path d=\"M9 21H5C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V12C3 10.75 3.2375 9.57917 3.7125 8.4875C4.1875 7.39583 4.82917 6.44583 5.6375 5.6375C6.44583 4.82917 7.39583 4.1875 8.4875 3.7125C9.57917 3.2375 10.75 3 12 3C13.25 3 14.4208 3.2375 15.5125 3.7125C16.6042 4.1875 17.5542 4.82917 18.3625 5.6375C19.1708 6.44583 19.8125 7.39583 20.2875 8.4875C20.7625 9.57917 21 10.75 21 12V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H15V13H19V12C19 10.05 18.3208 8.39583 16.9625 7.0375C15.6042 5.67917 13.95 5 12 5C10.05 5 8.39583 5.67917 7.0375 7.0375C5.67917 8.39583 5 10.05 5 12V13H9V21ZM7 15H5V19H7V15ZM17 15V19H19V15H17Z\" fill=\"currentColor\"/>","incoming_call":"<path d=\"M13 11V4.99998H15V7.59998L20 2.59998L21.4 3.99998L16.4 8.99998H19V11H13ZM19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7291 9.89167 17.4416 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19164 3 6.13331 3 4.04998C3 3.74998 3.1 3.49998 3.3 3.29998C3.5 3.09998 3.75 2.99998 4.05 2.99998H8.1C8.33333 2.99998 8.54167 3.07914 8.725 3.23748C8.90833 3.39581 9.01667 3.58331 9.05 3.79998L9.7 7.29998C9.73333 7.56664 9.725 7.79164 9.675 7.97498C9.625 8.15831 9.53333 8.31664 9.4 8.44998L6.975 10.9C7.30833 11.5166 7.70417 12.1125 8.1625 12.6875C8.62083 13.2625 9.125 13.8166 9.675 14.35C10.1917 14.8666 10.7333 15.3458 11.3 15.7875C11.8667 16.2291 12.4667 16.6333 13.1 17L15.45 14.65C15.6 14.5 15.7958 14.3875 16.0375 14.3125C16.2792 14.2375 16.5167 14.2166 16.75 14.25L20.2 14.95C20.4333 15.0166 20.625 15.1375 20.775 15.3125C20.925 15.4875 21 15.6833 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21ZM6.025 8.99998L7.675 7.34998L7.25 4.99998H5.025C5.10833 5.68331 5.225 6.35831 5.375 7.02498C5.525 7.69164 5.74167 8.34998 6.025 8.99998ZM14.975 17.95C15.625 18.2333 16.2875 18.4583 16.9625 18.625C17.6375 18.7916 18.3167 18.9 19 18.95V16.75L16.65 16.275L14.975 17.95Z\" fill=\"currentColor\"/>","outgoing_call":"<path d=\"M21.4 2.59998V8.59998L19.4 8.59998V5.99998L14.4 11L13 9.59998L18 4.59998L15.4 4.59998V2.59998L21.4 2.59998ZM19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7291 9.89167 17.4416 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19164 3 6.13331 3 4.04998C3 3.74998 3.1 3.49998 3.3 3.29998C3.5 3.09998 3.75 2.99998 4.05 2.99998H8.1C8.33333 2.99998 8.54167 3.07914 8.725 3.23748C8.90833 3.39581 9.01667 3.58331 9.05 3.79998L9.7 7.29998C9.73333 7.56664 9.725 7.79164 9.675 7.97498C9.625 8.15831 9.53333 8.31664 9.4 8.44998L6.975 10.9C7.30833 11.5166 7.70417 12.1125 8.1625 12.6875C8.62083 13.2625 9.125 13.8166 9.675 14.35C10.1917 14.8666 10.7333 15.3458 11.3 15.7875C11.8667 16.2291 12.4667 16.6333 13.1 17L15.45 14.65C15.6 14.5 15.7958 14.3875 16.0375 14.3125C16.2792 14.2375 16.5167 14.2166 16.75 14.25L20.2 14.95C20.4333 15.0166 20.625 15.1375 20.775 15.3125C20.925 15.4875 21 15.6833 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21ZM6.025 8.99998L7.675 7.34998L7.25 4.99998H5.025C5.10833 5.68331 5.225 6.35831 5.375 7.02498C5.525 7.69164 5.74167 8.34998 6.025 8.99998ZM14.975 17.95C15.625 18.2333 16.2875 18.4583 16.9625 18.625C17.6375 18.7916 18.3167 18.9 19 18.95V16.75L16.65 16.275L14.975 17.95Z\" fill=\"currentColor\"/>","star":"<path d=\"M8.85 16.825L12 14.925L15.15 16.85L14.325 13.25L17.1 10.85L13.45 10.525L12 7.125L10.55 10.5L6.9 10.825L9.675 13.25L8.85 16.825ZM5.825 21L7.45 13.975L2 9.25L9.2 8.625L12 2L14.8 8.625L22 9.25L16.55 13.975L18.175 21L12 17.275L5.825 21Z\" fill=\"currentColor\"/>","copy":"<path d=\"M9 18C8.45 18 7.97917 17.8042 7.5875 17.4125C7.19583 17.0208 7 16.55 7 16V4C7 3.45 7.19583 2.97917 7.5875 2.5875C7.97917 2.19583 8.45 2 9 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H9ZM9 16H18V4H9V16ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6H5V20H16V22H5Z\" fill=\"currentColor\"/>","upload":"<path d=\"M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z\" fill=\"currentColor\"/>","web-outbound":"<path d=\"M11.8555 5.12433C11.8435 5.1349 11.8295 5.14516 11.8164 5.15753C11.5858 5.37624 11.2868 5.78807 10.9922 6.44855C10.6725 7.16531 10.404 8.07297 10.2256 9.11749L11.8555 9.12042V11.1273L10.0107 11.1243C9.99716 11.4092 9.99024 11.7002 9.99023 11.9964C9.99025 12.559 10.0143 13.1031 10.0615 13.6224L13.9326 13.6282C13.9802 13.1071 14.0078 12.5611 14.0078 11.9964C14.0078 11.783 14.0026 11.5722 13.9951 11.3646H16.002C16.0088 11.5733 16.0137 11.784 16.0137 11.9964L16.0078 12.4593C15.9988 12.8575 15.9767 13.2493 15.9453 13.6321L18.7959 13.637C18.9224 13.1108 18.9921 12.5614 18.9922 11.9964C18.9922 11.7833 18.9785 11.5727 18.959 11.3646H20.9736C20.9881 11.5733 20.998 11.7839 20.998 11.9964L20.9863 12.4593C20.7452 17.2152 16.8137 20.9972 11.999 20.9974L11.998 20.9964L11.5361 20.9857C6.93453 20.7524 3.24507 17.062 3.01172 12.4593L3 11.9964C3.0001 7.07317 6.95175 3.07438 11.8555 2.99738V5.12433ZM10.375 15.6282C10.5409 16.3588 10.7521 17.005 10.9922 17.5433C11.2868 18.2038 11.5858 18.6145 11.8164 18.8333C11.8996 18.9122 11.9607 18.9527 11.998 18.9739C12.0353 18.9527 12.0973 18.9123 12.1807 18.8333C12.4113 18.6144 12.7114 18.2034 13.0059 17.5433C13.2452 17.0066 13.4525 16.3619 13.6182 15.6341L10.375 15.6282ZM15.6689 15.638C15.464 16.6751 15.1732 17.609 14.8184 18.3958C16.1272 17.818 17.2261 16.8522 17.9668 15.6419L15.6689 15.638ZM6.0166 15.6204C6.75667 16.8396 7.85985 17.8133 9.1748 18.3948C8.81867 17.6049 8.5292 16.6662 8.32422 15.6243L6.0166 15.6204ZM5.0625 11.1165C5.02631 11.4048 5.00587 11.6983 5.00586 11.9964C5.0059 12.553 5.07343 13.0946 5.19629 13.6136L8.04883 13.6185C8.01811 13.24 7.99718 12.8527 7.98828 12.4593L7.9834 11.9964C7.9834 11.7012 7.99054 11.4093 8.00293 11.1214L5.0625 11.1165ZM21 8.0423H18.9932V6.42316L15.5625 9.72296L14.1436 8.30402L17.5752 5.00421H15.999V2.99738H21V8.0423ZM9.1748 5.59601C7.60384 6.2907 6.33798 7.54725 5.62891 9.11066L8.19434 9.11456C8.39658 7.77188 8.73525 6.57084 9.1748 5.59601Z\" fill=\"currentColor\"/>","web-inbound":"<path d=\"M11.8564 5.13116C11.8445 5.14174 11.8305 5.152 11.8174 5.16437C11.5868 5.38308 11.2878 5.79491 10.9932 6.45538C10.6735 7.17215 10.405 8.07981 10.2266 9.12433L11.8564 9.12726V11.1341L10.0117 11.1312C9.99814 11.4161 9.99121 11.707 9.99121 12.0032C9.99123 12.5658 10.0153 13.1099 10.0625 13.6292L13.9336 13.6351C13.9812 13.114 14.0088 12.568 14.0088 12.0032C14.0088 11.7898 14.0036 11.5791 13.9961 11.3714H16.0029C16.0098 11.5801 16.0146 11.7908 16.0146 12.0032L16.0088 12.4661C15.9998 12.8643 15.9776 13.2561 15.9463 13.639L18.7969 13.6439C18.9234 13.1176 18.9931 12.5683 18.9932 12.0032C18.9932 11.7901 18.9795 11.5796 18.96 11.3714H20.9746C20.9891 11.5802 20.999 11.7908 20.999 12.0032L20.9873 12.4661C20.7462 17.2221 16.8147 21.004 12 21.0042L11.999 21.0032L11.5371 20.9925C6.93551 20.7592 3.24605 17.0688 3.0127 12.4661L3.00098 12.0032C3.00107 7.08001 6.95272 3.08122 11.8564 3.00421V5.13116ZM10.376 15.6351C10.5419 16.3656 10.7531 17.0118 10.9932 17.5501C11.2878 18.2106 11.5867 18.6214 11.8174 18.8401C11.9006 18.9191 11.9617 18.9595 11.999 18.9808C12.0363 18.9595 12.0983 18.9192 12.1816 18.8401C12.4122 18.6212 12.7124 18.2103 13.0068 17.5501C13.2461 17.0135 13.4535 16.3687 13.6191 15.6409L10.376 15.6351ZM15.6699 15.6448C15.465 16.682 15.1742 17.6159 14.8193 18.4026C16.1282 17.8248 17.2271 16.8591 17.9678 15.6487L15.6699 15.6448ZM6.01758 15.6273C6.75764 16.8465 7.86083 17.8202 9.17578 18.4017C8.81965 17.6117 8.53017 16.673 8.3252 15.6312L6.01758 15.6273ZM5.06348 11.1234C5.02729 11.4116 5.00684 11.7052 5.00684 12.0032C5.00687 12.5598 5.07441 13.1014 5.19727 13.6204L8.0498 13.6253C8.01908 13.2468 7.99815 12.8595 7.98926 12.4661L7.98438 12.0032C7.98438 11.708 7.99152 11.4161 8.00391 11.1282L5.06348 11.1234ZM20.999 4.40948L17.5684 7.71027H19.1445V9.71613H14.1436V4.67218H16.1504V6.29132L19.5811 2.99054L20.999 4.40948ZM9.17578 5.60284C7.60481 6.29754 6.33896 7.55408 5.62988 9.11749L8.19531 9.1214C8.39755 7.77871 8.73623 6.57767 9.17578 5.60284Z\" fill=\"currentColor\"/>"};
  /* Legacy names used by the kit's components → closest Figma icon. */
  var ALIASES={"high-priority":"priority-level-high","normal":"priority-level-normal","low-priority":"priority-level-low","check":"done","remove":"remove","expand-more":"expand_more","menu":"menu","delete":"delete","edit":"edit","search":"search","info":"info","add":"add","business":"business","parking":"local_parking","car":"directions_car","exit":"exit","description":"description","calendar":"calendar_today","chevron-left":"chevron_left","chevron-right":"chevron_right","close":"close","person":"person_outline"};
  var iconNames=["priority_high","confirmation_number","low_priority","arrow_drop_down","attach_file","insert_link","arrow_back","expand_more","expand_less","chevron_right","chevron_left","add_box","add","photo_camera","priority-level-high","priority-level-normal","priority-level-low","calendar_today","pending","report","not_interested","done","home","Date in","Date out","ads_click","join_full","diamond","edit","remove","close","delete","calendar_view_week","calendar_view_month","calendar_view_day","menu","person_outline","business","local_parking","directions_car","entrance","exit","tasks","search","info","people_outline","admin_panel_settings","more_horiz","arrow_upward","arrow_forward","arrow_downward","flag","notifications","imagesearch_roller","Certification","headset_mic","history","screenshot_monitor","Whiteboard","Record","filter_list","pen","eraser","line-weight","play_circle_outline","pause_circle","volume_off","volume_up","mic_none","schedule","summarize","receipt_long","file_download","key","text_snippet","article","description","sync_alt","sync","change_circle","data_object","assignment","login","logout","emoji_events","settings","airline_seat_individual_suite","flight","directions_boat","sort","chat","mail_outline","sent","phone","language","on-off","dashboard","credit-card","steps","save","linked_services","side_navigation","tools","files","campaign","open_in_new","dark_mode","headphones","incoming_call","outgoing_call","star","copy","upload","web-outbound","web-inbound"];
  var CATEGORIES=[{"name":"Navigation & arrows","icons":["arrow_back","arrow_forward","arrow_upward","arrow_downward","arrow_drop_down","expand_more","expand_less","chevron_left","chevron_right","menu","more_horiz","side_navigation","open_in_new","home","login","logout","entrance","exit"]},{"name":"Actions & editing","icons":["add","add_box","remove","close","done","edit","delete","search","filter_list","sort","save","copy","upload","file_download","attach_file","insert_link","sync","sync_alt","change_circle","settings","tools","key","pen","eraser","line-weight","imagesearch_roller","ads_click","on-off","dark_mode"]},{"name":"Status & priority","icons":["priority_high","low_priority","priority-level-high","priority-level-normal","priority-level-low","pending","report","not_interested","info","flag","notifications","star","Certification","emoji_events","diamond"]},{"name":"Calendar & time","icons":["calendar_today","calendar_view_day","calendar_view_week","calendar_view_month","Date in","Date out","schedule","history"]},{"name":"Documents & data","icons":["description","article","text_snippet","summarize","receipt_long","assignment","files","data_object","tasks","dashboard","Whiteboard","screenshot_monitor","confirmation_number"]},{"name":"People, places & travel","icons":["person_outline","people_outline","admin_panel_settings","business","local_parking","directions_car","directions_boat","flight","airline_seat_individual_suite","steps","join_full","language","linked_services","credit-card"]},{"name":"Communication & media","icons":["chat","mail_outline","sent","phone","incoming_call","outgoing_call","headset_mic","headphones","mic_none","volume_up","volume_off","play_circle_outline","pause_circle","Record","campaign","photo_camera","web-outbound","web-inbound"]}];
  Object.keys(ALIASES).forEach(function(k){ if(!(k in ICONS)) ICONS[k]=ICONS[ALIASES[k]]; });
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function Icon(p){
    p=p||{}; var markup=Object.prototype.hasOwnProperty.call(ICONS,p.name)?ICONS[p.name]:null;
    if(markup==null) return null;
    var size=p.size!=null?p.size:24, title=p.title;
    var rest={}; for(var k in p){ if(k!=="name"&&k!=="size"&&k!=="title"&&k!=="className") rest[k]=p[k]; }
    var a=Object.assign({ width:size, height:size, viewBox:"0 0 24 24", fill:"none", focusable:"false" }, rest, {
      className:"aa-icon"+(p.className?" "+p.className:""),
      dangerouslySetInnerHTML:{ __html:(title?"<title>"+esc(title)+"</title>":"")+markup } });
    if(title){ a.role="img"; a["aria-label"]=title; } else { a["aria-hidden"]="true"; }
    return h("svg",a);
  }
  Object.assign(window.Aambience,{Icon:Icon, ICONS:ICONS, iconNames:iconNames, ICON_ALIASES:ALIASES, ICON_CATEGORIES:CATEGORIES});
})();
/* Logo */
/* Logo — Figma "logo-Ambience" component set (146:744 Default, 146:745 white-letters), instance I20:943;67:11971 in Header 20:943. Generated from ref/aicons/logo-raw.svg. */
(function(){ var R=window.React,h=R.createElement;
  var WORDMARK="<path d=\"M68.4892 51.0872H62.3566L61.2168 53.909H56.5798L63.0683 37.098H67.8572L74.2178 53.909H69.5289L68.4892 51.0872ZM67.3235 47.7604L65.422 42.3159L63.5724 47.7604H67.3235Z\"/><path d=\"M84.5575 42.644H88.6125V53.9091H84.5575V52.6742C83.6197 53.9588 82.15 54.2869 81.0343 54.2869C79.8185 54.2869 78.3229 53.933 76.9533 52.4972C75.8636 51.3379 75.3317 50.0533 75.3317 48.3631C75.3317 46.2454 76.1675 44.7599 77.0812 43.8512C78.0449 42.8928 79.5387 42.2625 81.1603 42.2625C82.9858 42.2625 84.0756 43.1951 84.5556 43.724V42.6403L84.5575 42.644ZM80.2985 46.426C79.7407 46.955 79.4886 47.6867 79.4886 48.2655C79.4886 48.9198 79.7666 49.6257 80.2745 50.1049C80.7044 50.5085 81.4142 50.8606 82.1 50.8606C82.7857 50.8606 83.4177 50.5841 83.9255 50.0791C84.2813 49.727 84.6853 49.1723 84.6853 48.2655C84.6853 47.7365 84.5334 47.0306 83.8995 46.426C83.5196 46.0722 82.9358 45.6943 82.074 45.6943C81.5681 45.6943 80.8823 45.8713 80.3004 46.426H80.2985Z\"/><path d=\"M91.398 42.6439H95.453V44.0041C96.4167 42.8448 97.7344 42.4412 98.8483 42.4412C99.66 42.4412 100.42 42.6181 101.028 42.9443C101.864 43.3719 102.32 44.0023 102.599 44.5571C103.055 43.7516 103.639 43.2724 104.145 42.9941C104.957 42.5407 105.743 42.4393 106.502 42.4393C107.338 42.4393 108.708 42.5647 109.646 43.4733C110.659 44.4557 110.709 45.7919 110.709 46.5734V53.9072H106.654V48.3373C106.654 47.1522 106.528 46.3467 106.071 45.9173C105.843 45.7164 105.539 45.5394 105.007 45.5394C104.551 45.5394 104.171 45.6648 103.815 45.9928C103.131 46.6471 103.079 47.5816 103.079 48.1345V53.9053H99.0244V48.3354C99.0244 47.2517 98.9484 46.3946 98.4925 45.9154C98.1366 45.5376 97.6807 45.462 97.2767 45.462C96.8467 45.462 96.4909 45.5376 96.161 45.8657C95.4512 46.5458 95.4512 47.6295 95.4512 48.3354V53.9053H91.3961V42.6402L91.398 42.6439Z\"/><path d=\"M117.576 35.5369V43.7276C118.312 42.9462 119.4 42.2661 120.947 42.2661C122.341 42.2661 123.836 42.7195 124.95 43.7792C125.99 44.7616 126.8 46.3246 126.8 48.2396C126.8 50.0292 126.116 51.6161 124.974 52.7257C123.911 53.7597 122.617 54.2887 120.995 54.2887C120.209 54.2887 118.714 54.1375 117.574 52.6759V53.9108H113.519V35.5369H117.574H117.576ZM121.859 50.1048C122.391 49.5758 122.645 48.9197 122.645 48.3409C122.645 47.5853 122.315 46.8794 121.859 46.426C121.503 46.0721 120.921 45.6942 120.059 45.6942C119.3 45.6942 118.666 45.9725 118.21 46.4499C117.804 46.8775 117.45 47.635 117.45 48.2654C117.45 48.9455 117.78 49.7012 118.312 50.1804C118.742 50.5582 119.401 50.8605 120.059 50.8605C120.643 50.8605 121.301 50.6596 121.859 50.1048Z\"/><path d=\"M131.159 35.6881C132.427 35.6881 133.44 36.6963 133.44 37.957C133.44 39.2177 132.427 40.2258 131.159 40.2258C129.891 40.2258 128.877 39.2177 128.877 37.957C128.877 36.6963 129.891 35.6881 131.159 35.6881ZM133.186 42.644V53.9091H129.131V42.644H133.186Z\"/><path d=\"M147.961 49.0211H139.521C139.521 49.6257 139.749 50.433 140.231 50.9122C140.485 51.1647 140.991 51.4669 141.902 51.4669C142.004 51.4669 142.712 51.4411 143.22 51.1647C143.474 51.0135 143.752 50.761 143.93 50.409H147.807C147.629 51.0393 147.275 51.9203 146.439 52.7276C145.604 53.5331 144.286 54.2906 141.827 54.2906C140.331 54.2906 138.531 53.9625 137.138 52.5765C136.402 51.8448 135.466 50.4588 135.466 48.3171C135.466 46.426 136.176 44.9147 137.164 43.9563C138.101 43.0495 139.571 42.3177 141.801 42.3177C143.118 42.3177 144.816 42.5942 146.16 43.8549C147.757 45.3681 147.959 47.3328 147.959 48.5935V49.0211H147.961ZM144.236 46.7025C144.134 46.2749 143.88 45.7957 143.576 45.4934C143.044 44.9645 142.308 44.8889 141.904 44.8889C141.22 44.8889 140.689 45.0658 140.257 45.4934C139.977 45.7957 139.725 46.1993 139.649 46.7025H144.236Z\"/><path d=\"M150.293 42.644H154.348V44.0558C155.463 42.5942 156.957 42.3933 157.947 42.3933C159.113 42.3933 160.354 42.6698 161.292 43.6024C162.256 44.5608 162.356 45.5174 162.356 46.7523V53.9091H158.301V48.2138C158.301 47.5577 158.327 46.5753 157.793 46.0206C157.413 45.6169 156.907 45.5413 156.501 45.5413C155.867 45.5413 155.335 45.768 155.006 46.0703C154.6 46.4482 154.348 47.1799 154.348 47.86V53.9091H150.293V42.644Z\"/><path d=\"M173.683 53.6585C172.593 54.1874 171.706 54.2888 170.87 54.2888C168.664 54.2888 167.221 53.3562 166.409 52.5747C165.345 51.5407 164.659 50.0294 164.659 48.365C164.659 46.7007 165.343 45.1138 166.485 44.0043C167.549 42.9961 169.12 42.2902 171.046 42.2902C171.756 42.2902 172.667 42.4155 173.681 42.9205V46.2971C173.149 45.9192 172.439 45.5654 171.578 45.5654C170.614 45.5654 170.006 45.9432 169.6 46.3468C169.042 46.9016 168.814 47.6315 168.814 48.2876C168.814 48.9438 169.042 49.6479 169.524 50.1787C169.904 50.5823 170.564 51.0357 171.602 51.0357C172.186 51.0357 172.945 50.9104 173.679 50.28V53.6566L173.683 53.6585Z\"/><path d=\"M188 49.0211H179.56C179.56 49.6257 179.788 50.433 180.27 50.9122C180.524 51.1647 181.029 51.4669 181.941 51.4669C182.043 51.4669 182.751 51.4411 183.259 51.1647C183.513 51.0135 183.791 50.761 183.969 50.409H187.846C187.668 51.0393 187.314 51.9203 186.478 52.7276C185.642 53.5331 184.325 54.2906 181.865 54.2906C180.37 54.2906 178.57 53.9625 177.176 52.5765C176.441 51.8448 175.505 50.4588 175.505 48.3171C175.505 46.426 176.215 44.9147 177.202 43.9563C178.14 43.0495 179.61 42.3177 181.839 42.3177C183.157 42.3177 184.855 42.5942 186.198 43.8549C187.796 45.3681 187.998 47.3328 187.998 48.5935V49.0211H188ZM184.275 46.7025C184.173 46.2749 183.919 45.7957 183.615 45.4934C183.083 44.9645 182.347 44.8889 181.943 44.8889C181.259 44.8889 180.727 45.0658 180.296 45.4934C180.016 45.7957 179.764 46.1993 179.688 46.7025H184.275Z\"/>";
  var TREE="<path d=\"M34.8367 6.62598C31.1301 8.77136 30.2535 11.6743 32.1587 15.495C35.8653 13.3496 36.7419 10.4467 34.8367 6.62598Z\"/><path d=\"M39.9814 14.5052C35.6984 14.7117 33.5764 16.8865 33.4985 21.1515C37.7815 20.9451 39.9036 18.7702 39.9814 14.5052Z\"/><path d=\"M53.5348 17.0635C51.7705 16.4369 50.5473 16.964 49.8022 18.6744C51.5666 19.3011 52.7898 18.7739 53.5348 17.0635Z\"/><path d=\"M54.0499 35.2458C53.0232 33.6865 51.7277 33.375 50.0968 34.2911C51.1254 35.8503 52.419 36.1618 54.0499 35.2458Z\"/><path d=\"M54.9766 24.8138C53.4809 23.6895 52.1577 23.8296 50.9308 25.2377C52.4264 26.362 53.7497 26.2219 54.9766 24.8138Z\"/><path d=\"M51.4498 12.0558C49.5761 12.1 48.6254 13.0253 48.5438 14.8886C50.4175 14.8444 51.3683 13.9173 51.4498 12.0558Z\"/><path d=\"M27.7403 11.3941C31.345 7.56228 31.345 3.83182 27.7403 0C24.1356 3.83182 24.1356 7.56228 27.7403 11.3941Z\"/><path d=\"M49.224 26.725C45.371 23.1402 41.6199 23.1402 37.7668 26.725C41.6199 30.3099 45.371 30.3099 49.224 26.725Z\"/><path d=\"M46.7869 35.0689C44.3034 31.5799 41.3122 30.9698 37.6482 33.2018C40.1316 36.689 43.1229 37.3009 46.7869 35.0689Z\"/><path d=\"M40.973 42.9684C40.43 38.7292 38.08 36.7903 33.7896 37.0465C34.3326 41.2856 36.6826 43.2246 40.973 42.9684Z\"/><path d=\"M44.1737 4.71655C39.9759 5.59387 38.2282 8.07654 38.8287 12.2991C43.0246 11.4218 44.7741 8.93912 44.1737 4.71655Z\"/><path d=\"M48.6697 16.3816C44.4794 15.4748 41.8625 17.0285 40.6746 21.1258C44.8649 22.0326 47.4818 20.4788 48.6697 16.3816Z\"/><path d=\"M33.8897 0.436768C31.4285 1.80251 30.8187 3.69907 32.0252 6.2315C34.4846 4.86576 35.0962 2.9692 33.8897 0.436768Z\"/><path d=\"M39.7852 1.3584C37.4166 2.13619 36.5678 3.68256 37.1887 6.08413C39.5572 5.30634 40.406 3.75997 39.7852 1.3584Z\"/><path d=\"M48.0637 9.52515C45.5729 9.6302 44.3312 10.889 44.2719 13.368C46.7627 13.263 48.0044 12.0041 48.0637 9.52515Z\"/><path d=\"M52.9529 20.958C50.6677 19.9664 48.9979 20.5543 47.8507 22.7569C50.1358 23.7484 51.8057 23.1605 52.9529 20.958Z\"/><path d=\"M47.1279 41.1418C46.1939 38.8416 44.587 38.1007 42.2185 38.873C43.1526 41.1732 44.7594 41.9141 47.1279 41.1418Z\"/><path d=\"M51.2868 31.9355C49.5521 30.1532 47.784 30.0648 45.8788 31.6664C47.6135 33.4487 49.3815 33.5372 51.2868 31.9355Z\"/><path d=\"M55.4105 28.7359C53.7296 26.9038 51.9634 26.7637 50.0137 28.3101C51.6946 30.1422 53.4608 30.2804 55.4105 28.7359Z\"/><path d=\"M53.0994 38.3349C51.4184 36.5028 49.6522 36.3627 47.7025 37.9091C49.3835 39.7412 51.1497 39.8794 53.0994 38.3349Z\"/><path d=\"M27.7403 23.8683C31.1782 20.2134 31.1782 16.6581 27.7403 13.0032C24.3024 16.6581 24.3024 20.2134 27.7403 23.8683Z\"/><path d=\"M20.5717 6.62598C18.6665 10.4467 19.5431 13.3496 23.2497 15.495C25.1549 11.6743 24.2783 8.77136 20.5717 6.62598Z\"/><path d=\"M15.427 14.5052C15.5048 18.7684 17.6269 20.9451 21.9099 21.1515C21.8321 16.8865 19.71 14.7117 15.427 14.5052Z\"/><path d=\"M1.87378 17.0635C2.62066 18.7739 3.842 19.2992 5.60635 18.6744C4.85947 16.964 3.63813 16.4369 1.87378 17.0635Z\"/><path d=\"M1.36023 35.2458C2.993 36.1618 4.28661 35.8485 5.31334 34.2911C3.68058 33.375 2.38696 33.6884 1.36023 35.2458Z\"/><path d=\"M0.433716 24.8138C1.66061 26.2219 2.98573 26.362 4.4795 25.2377C3.2526 23.8296 1.92749 23.6895 0.433716 24.8138Z\"/><path d=\"M3.96057 12.0558C4.04212 13.9173 4.99287 14.8444 6.86656 14.8886C6.78502 13.0271 5.83427 12.1 3.96057 12.0558Z\"/><path d=\"M6.18652 26.725C10.0396 30.3099 13.7907 30.3099 17.6437 26.725C13.7907 23.1402 10.0396 23.1402 6.18652 26.725Z\"/><path d=\"M8.62354 35.0689C12.2875 37.3009 15.2788 36.689 17.7622 33.2018C14.0982 30.9698 11.107 31.5817 8.62354 35.0689Z\"/><path d=\"M14.4374 42.9684C18.7259 43.2246 21.0778 41.2856 21.6208 37.0465C17.3304 36.7903 14.9804 38.7292 14.4374 42.9684Z\"/><path d=\"M11.2367 4.71655C10.6362 8.93912 12.3839 11.4199 16.5816 12.2991C17.1839 8.07654 15.4344 5.59387 11.2367 4.71655Z\"/><path d=\"M6.74036 16.3816C7.92833 20.4788 10.5452 22.0326 14.7355 21.1258C13.5476 17.0285 10.9307 15.4748 6.74036 16.3816Z\"/><path d=\"M21.5188 0.436768C20.3123 2.9692 20.9239 4.86576 23.3833 6.2315C24.5898 3.69907 23.9782 1.80251 21.5188 0.436768Z\"/><path d=\"M15.6235 1.3584C15.0026 3.75997 15.8514 5.30634 18.22 6.08413C18.8427 3.68256 17.992 2.13619 15.6235 1.3584Z\"/><path d=\"M7.34644 9.52515C7.40574 12.0041 8.64746 13.2611 11.1383 13.368C11.079 10.889 9.83729 9.63205 7.34644 9.52515Z\"/><path d=\"M2.4574 20.958C3.6046 23.1605 5.27443 23.7484 7.55957 22.7569C6.41237 20.5543 4.74253 19.9664 2.4574 20.958Z\"/><path d=\"M8.28235 41.1419C10.6509 41.916 12.2577 41.1732 13.1918 38.873C10.8232 38.0989 9.21456 38.8417 8.28235 41.1419Z\"/><path d=\"M4.12378 31.9356C6.02713 33.5372 7.79704 33.4487 9.53174 31.6665C7.62839 30.0648 5.85848 30.1514 4.12378 31.9356Z\"/><path d=\"M0 28.7359C1.94968 30.2822 3.71589 30.1422 5.39685 28.3101C3.44716 26.7637 1.68095 26.9038 0 28.7359Z\"/><path d=\"M2.31116 38.3349C4.26084 39.8812 6.02705 39.7412 7.708 37.9091C5.75832 36.3627 3.99211 36.5028 2.31116 38.3349Z\"/><path d=\"M19.3042 29.7994C25.6444 31.801 29.0915 46.6915 23.3944 54.2888H32.6239C34.8905 49.0839 32.0828 40.5871 30.9393 37.8261C28.9618 33.0488 31.9512 29.8307 36.742 29.0806C36.742 29.0806 33.7915 27.6485 29.9107 29.4142C32.2792 24.6829 38.1876 23.4868 38.7547 23.2601C38.7547 23.2601 31.7492 21.3764 27.7423 26.7251C27.7331 26.7085 27.7219 26.6993 27.7127 26.6846V26.6551C23.7058 21.3064 16.6929 23.3043 16.6929 23.3043C17.26 23.5292 24.7084 24.0637 26.2226 31.8895C22.3028 28.524 19.306 29.7994 19.306 29.7994H19.3042Z\"/>";
  var COLORS={ mint:"#D3F6E1", green:"#21D367", white:"#FFFFFF", slate:"#3A3F47" };
  var FULL={ w:188, h:55 }, MARK={ w:56, h:55 };
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function Logo(p){
    p=p||{}; var variant=p.variant==="mark"?"mark":"full", tone=(p.tone==="white"||p.tone==="onLight")?p.tone:"brand";
    var height=p.height!=null?p.height:40, box=variant==="mark"?MARK:FULL;
    var title=p.title!==undefined?p.title:"Aambience";
    var body = variant==="mark"
      ? '<g fill="'+(tone==="white"?COLORS.white:COLORS.green)+'">'+TREE+'</g>'
      : '<g fill="'+(tone==="white"?COLORS.white:tone==="onLight"?COLORS.slate:COLORS.mint)+'">'+WORDMARK+'</g><g fill="'+COLORS.green+'">'+TREE+'</g>';
    var rest={}; for(var k in p){ if(["variant","tone","height","title","className"].indexOf(k)<0) rest[k]=p[k]; }
    var a=Object.assign({ width:Math.round(height*box.w/box.h*100)/100, height:height, viewBox:"0 0 "+box.w+" "+box.h, fill:"none", focusable:"false" }, rest, {
      className:"aa-logo aa-logo--"+variant+" aa-logo--"+tone+(p.className?" "+p.className:""),
      dangerouslySetInnerHTML:{ __html:(title?"<title>"+esc(title)+"</title>":"")+body } });
    if(title){ a.role="img"; a["aria-label"]=title; } else { a["aria-hidden"]="true"; }
    return h("svg",a);
  }
  Object.assign(window.Aambience,{Logo:Logo});
})();
/* Checkbox */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function Checkbox(p) {
    var ref = R.useRef(null);
    var ind = !!p.indeterminate;
    R.useEffect && R.useEffect(function () { if (ref.current) ref.current.indeterminate = ind; }, [ind]);
    var rest = Object.assign({}, p);
    ["label", "filled", "invalid", "indeterminate", "className", "onChange", "checked", "defaultChecked"].forEach(function (k) { delete rest[k]; });
    var controlled = p.checked !== undefined;
    var st = R.useState(!!p.defaultChecked), inner = st[0], setInner = st[1];
    var on = controlled ? !!p.checked : inner;
    function change(e) { if (!controlled) setInner(e.target.checked); if (p.onChange) p.onChange(e.target.checked, e); }
    var cls = cx("aa-checkbox", p.filled && "aa-checkbox--filled", on && "is-checked", ind && "is-indeterminate",
      p.invalid && "is-invalid", p.disabled && "is-disabled", p.className);
    return h("label", { className: cls },
      h("input", Object.assign({ type: "checkbox", ref: ref, className: "aa-checkbox__input",
        "aria-invalid": p.invalid || undefined, "aria-checked": ind ? "mixed" : undefined }, rest, { checked: on, onChange: change })),
      h("span", { className: "aa-checkbox__box", "aria-hidden": "true" },
        (on || ind) ? h(A.Icon, { name: ind ? "remove" : "check", size: 20 }) : null),
      p.label != null ? h("span", { className: "aa-checkbox__label" }, p.label) : null);
  }
  Object.assign(window.Aambience, { Checkbox: Checkbox });
})();
/* Radio */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function Radio(p) {
    var rest = Object.assign({}, p);
    ["label", "filled", "invalid", "className", "onChange", "checked"].forEach(function (k) { delete rest[k]; });
    var on = !!p.checked;
    function change(e) { if (p.onChange) p.onChange(p.value, e); }
    var cls = cx("aa-radio", p.filled && "aa-radio--filled", on && "is-checked", p.invalid && "is-invalid", p.disabled && "is-disabled", p.className);
    return h("label", { className: cls },
      h("input", Object.assign({ type: "radio", className: "aa-radio__input", "aria-invalid": p.invalid || undefined }, rest,
        { checked: p.checked === undefined ? undefined : on, onChange: change })),
      h("span", { className: "aa-radio__circle", "aria-hidden": "true" }, h("span", { className: "aa-radio__dot" })),
      p.label != null ? h("span", { className: "aa-radio__label" }, p.label) : null);
  }
  function RadioGroup(p) {
    var st = R.useState(p.defaultValue), inner = st[0], setInner = st[1];
    var controlled = p.value !== undefined, val = controlled ? p.value : inner;
    return h("div", { role: "radiogroup", "aria-label": p["aria-label"] || p.label, className: cx("aa-radio-group", p.className) },
      (p.options || []).map(function (o) {
        var opt = typeof o === "string" ? { value: o, label: o } : o;
        return h(Radio, { key: opt.value, name: p.name, value: opt.value, label: opt.label, checked: val === opt.value,
          filled: p.filled, invalid: p.invalid, disabled: p.disabled || opt.disabled,
          onChange: function (v, e) { if (!controlled) setInner(v); if (p.onChange) p.onChange(v, e); } });
      }));
  }
  Object.assign(window.Aambience, { Radio: Radio, RadioGroup: RadioGroup });
})();
/* Toggle */
(function () {
  var R = window.React, h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  function Toggle(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = p.id || "aa-toggle-" + (++uid);
    var controlled = p.checked !== undefined;
    var st = R.useState(!!p.defaultChecked), inner = st[0], setInner = st[1];
    var on = controlled ? !!p.checked : inner;
    function click(e) { if (p.disabled) return; var n = !on; if (!controlled) setInner(n); if (p.onChange) p.onChange(n, e); }
    var sw = h("button", { type: "button", role: "switch", id: idRef.current, "aria-checked": on ? "true" : "false",
      "aria-label": p.label ? undefined : p["aria-label"], disabled: p.disabled, name: p.name, onClick: click,
      className: cx("aa-toggle__track", on && "is-on") }, h("span", { className: "aa-toggle__knob" }));
    return h("span", { className: cx("aa-toggle", on && "is-on", p.disabled && "is-disabled", p.className) },
      sw, p.label != null ? h("label", { className: "aa-toggle__label", htmlFor: idRef.current }, p.label) : null);
  }
  Object.assign(window.Aambience, { Toggle: Toggle });
})();
/* Slider */
(function () {
  var R = window.React, h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function Slider(p) {
    var min = p.min != null ? +p.min : 0, max = p.max != null ? +p.max : 100;
    var controlled = p.value !== undefined;
    var st = R.useState(p.defaultValue != null ? +p.defaultValue : min), inner = st[0], setInner = st[1];
    var val = controlled ? +p.value : inner;
    var pct = max > min ? Math.max(0, Math.min(100, (val - min) / (max - min) * 100)) : 0;
    var rest = Object.assign({}, p);
    ["priority", "filled", "className", "onChange", "value", "defaultValue", "min", "max", "label", "style"].forEach(function (k) { delete rest[k]; });
    function change(e) { var v = +e.target.value; if (!controlled) setInner(v); if (p.onChange) p.onChange(v, e); }
    var cls = cx("aa-slider", "aa-slider--" + (p.priority || "primary"), p.filled === "outline" && "aa-slider--outline", p.disabled && "is-disabled", p.className);
    return h("input", Object.assign({ type: "range", min: min, max: max, "aria-label": p.label }, rest, {
      value: val, onChange: change, className: cls, style: Object.assign({ "--aa-slider-pct": pct + "%" }, p.style) }));
  }
  Object.assign(window.Aambience, { Slider: Slider });
})();
/* Snackbar */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments,Boolean).join(" "); }
  function Snackbar(p){
    var hasAction = p.actionLabel != null && p.actionLabel !== "";
    var layout = p.layout || (hasAction && p.onClose ? "stacked" : "inline");
    var msg = h("p",{className:"aa-snackbar__message"},p.message!=null?p.message:p.children);
    var close = p.onClose ? h("button",{type:"button",className:"aa-snackbar__close","aria-label":p.closeLabel||"Close",onClick:p.onClose},h(A.Icon,{name:"close",size:24})) : null;
    var action = hasAction ? h("button",{type:"button",className:"aa-snackbar__action",onClick:p.onAction},p.actionLabel) : null;
    var body = layout==="stacked"
      ? [h("div",{key:"t",className:"aa-snackbar__top"},msg,close), action?h("div",{key:"a",className:"aa-snackbar__actions"},action):null]
      : [h("div",{key:"t",className:"aa-snackbar__top"},msg,action,close)];
    return h("div",{role:p.role||"status","aria-live":p.role==="alert"?"assertive":"polite",className:cx("aa-snackbar","aa-snackbar--"+layout,p.className),style:p.style},body);
  }
  Object.assign(window.Aambience,{Snackbar:Snackbar}); })();
/* Label */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function Label(p){
    var rest=Object.assign({},p); delete rest.children; delete rest.className; delete rest.required; delete rest.as;
    var tag = p.as || (p.htmlFor ? "label" : "span");
    return h(tag,Object.assign({},rest,{className:["aa-label",p.className].filter(Boolean).join(" ")}),p.children!=null?p.children:"Label",p.required?h("span",{className:"aa-label__req","aria-hidden":"true"},"*"):null);
  }
  Object.assign(window.Aambience,{Label:Label}); })();
/* FieldLabel */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function FieldLabel(p){
    var rest=Object.assign({},p); delete rest.children; delete rest.className; delete rest.required; delete rest.as;
    var tag = p.as || (p.htmlFor ? "label" : "span");
    return h(tag,Object.assign({},rest,{className:["aa-fieldlabel",p.className].filter(Boolean).join(" ")}),p.children!=null?p.children:"Label",p.required?h("span",{className:"aa-fieldlabel__req","aria-hidden":"true"},"*"):null);
  }
  Object.assign(window.Aambience,{FieldLabel:FieldLabel}); })();
/* Dropdown */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments,Boolean).join(" "); }
  var uid=0;
  function Dropdown(p){
    var idRef=R.useRef(null); if(!idRef.current) idRef.current=p.id||"aa-dropdown-"+(++uid);
    var id=idRef.current, err=!!p.error;
    var controlled = p.value !== undefined;
    var st = R.useState(p.defaultValue!=null?p.defaultValue:""), inner=st[0], setInner=st[1];
    var val = controlled ? p.value : inner;
    var help = typeof p.error==="string" ? p.error : p.helper;
    var helpId = help ? id+"-help" : undefined;
    var placeholder = p.placeholder!=null ? p.placeholder : "Value";
    var opts = (p.options||[]).map(function(o,i){
      var ob = typeof o==="object" ? o : {value:String(o),label:String(o)};
      return h("option",{key:ob.value+"-"+i,value:ob.value,disabled:ob.disabled},ob.label!=null?ob.label:ob.value);
    });
    function change(e){ if(!controlled) setInner(e.target.value); if(p.onChange) p.onChange(e.target.value,e); }
    return h("div",{className:cx("aa-dropdown",p.stroke==="bottom"?"aa-dropdown--bottom":"aa-dropdown--all",p.filled&&"aa-dropdown--filled",p.disabled&&"is-disabled",err&&"is-error",p.className)},
      p.label ? h("label",{className:"aa-dropdown__label",htmlFor:id},p.label,p.required?"*":null) : null,
      h("div",{className:"aa-dropdown__box"},
        h("select",{id:id,name:p.name,className:cx("aa-dropdown__control",val===""&&"is-empty"),value:val,onChange:change,disabled:p.disabled,required:p.required,
          "aria-invalid":err||undefined,"aria-describedby":helpId,"aria-label":p.label?undefined:(p["aria-label"]||placeholder),onBlur:p.onBlur,onFocus:p.onFocus},
          h("option",{value:"",disabled:!!p.required},placeholder), opts),
        h("span",{className:"aa-dropdown__chevron"},h(A.Icon,{name:"expand-more",size:18}))),
      helpId ? h("span",{id:helpId,className:"aa-dropdown__help"},help) : null);
  }
  Object.assign(window.Aambience,{Dropdown:Dropdown}); })();
/* SearchInput */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments,Boolean).join(" "); }
  function SearchInput(p){
    var controlled = p.value !== undefined;
    var st = R.useState(p.defaultValue||""), inner=st[0], setInner=st[1];
    var val = controlled ? p.value : inner;
    var ref = R.useRef(null);
    var leading = !!p.leadingIcon;
    function set(v,e){ if(!controlled) setInner(v); if(p.onChange) p.onChange(v,e); }
    function clear(e){ set("",e); if(p.onClear) p.onClear(); if(ref.current && ref.current.focus) ref.current.focus(); }
    function key(e){ if(e.key==="Enter" && p.onSearch) p.onSearch(val); if(e.key==="Escape" && val) clear(e); }
    return h("div",{role:"search",className:cx("aa-search",p.stroke==="bottom"?"aa-search--bottom":"aa-search--all",leading&&"aa-search--leading",val!==""&&"is-filled",p.disabled&&"is-disabled",p.className)},
      leading ? h("span",{className:"aa-search__icon"},h(A.Icon,{name:"search",size:18})) : null,
      h("input",{ref:ref,type:"search",id:p.id,name:p.name,className:"aa-search__control",value:val,placeholder:p.placeholder!=null?p.placeholder:"Enter text",
        disabled:p.disabled,"aria-label":p["aria-label"]||p.placeholder||"Search",autoComplete:"off",
        onChange:function(e){ set(e.target.value,e); },onKeyDown:key,onFocus:p.onFocus,onBlur:p.onBlur}),
      leading
        ? h("button",{type:"button",className:"aa-search__btn aa-search__clear","aria-label":p.clearLabel||"Clear",onClick:clear,disabled:p.disabled||val===""},h(A.Icon,{name:"close",size:24}))
        : h("button",{type:"button",className:"aa-search__btn","aria-label":p.searchLabel||"Search",onClick:function(){ if(p.onSearch) p.onSearch(val); },disabled:p.disabled,tabIndex:p.onSearch?0:-1},h(A.Icon,{name:"search",size:18})));
  }
  Object.assign(window.Aambience,{SearchInput:SearchInput}); })();
/* Table */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments,Boolean).join(" "); }
  function Table(p){
    var cols=p.columns||[], rows=p.rows||[];
    var keyOf=function(r,i){ var k=p.rowKey||"id"; return typeof k==="function"?k(r,i):(r[k]!=null?r[k]:i); };
    var sel=p.selectedKeys||[];
    function isSel(k){ return sel.indexOf(k)!==-1; }
    var allKeys=rows.filter(function(r){return !r.disabled;}).map(keyOf);
    var allOn=allKeys.length>0&&allKeys.every(isSel), someOn=!allOn&&allKeys.some(isSel);
    function toggle(k){ if(!p.onSelectionChange) return; p.onSelectionChange(isSel(k)?sel.filter(function(x){return x!==k;}):sel.concat([k])); }
    function toggleAll(){ if(p.onSelectionChange) p.onSelectionChange(allOn?[]:allKeys); }
    var headRef=R.useRef(null);
    R.useEffect&&R.useEffect(function(){ if(headRef.current) headRef.current.indeterminate=someOn; });
    var head=h("tr",null,
      p.selectable?h("th",{className:"aa-table__sel",scope:"col"},h("input",{ref:headRef,type:"checkbox",className:"aa-table__check",checked:allOn,onChange:toggleAll,"aria-label":p.selectAllLabel||"Select all rows"})):null,
      cols.map(function(c){
        var sorted=p.sortBy===c.key, dir=sorted?(p.sortDirection||"desc"):null;
        var inner=[h("span",{key:"t",className:"aa-table__htext"},c.title!=null?c.title:c.key),
          c.sortable!==false&&(c.sortable||p.onSort)?h("span",{key:"i",className:cx("aa-table__sort",dir==="asc"&&"is-asc",!sorted&&"is-idle")},h(A.Icon,{name:"expand-more",size:24})):null];
        var canSort=!!p.onSort&&c.sortable!==false;
        return h("th",{key:c.key,scope:"col",style:c.width?{width:c.width}:undefined,className:cx("aa-table__th",c.muted&&"is-muted",c.align&&"is-"+c.align),
          "aria-sort":sorted?(dir==="asc"?"ascending":"descending"):undefined},
          canSort?h("button",{type:"button",className:"aa-table__hbtn",onClick:function(){p.onSort(c.key,sorted&&dir==="desc"?"asc":"desc");}},inner):h("div",{className:"aa-table__hbtn"},inner));
      }));
    var body=rows.length?rows.map(function(r,i){
      var k=keyOf(r,i), on=isSel(k);
      return h("tr",{key:k,className:cx(on&&"is-selected",r.disabled&&"is-muted"),onClick:p.onRowClick?function(){p.onRowClick(r,i);}:undefined},
        p.selectable?h("td",{className:"aa-table__sel"},h("input",{type:"checkbox",className:"aa-table__check",checked:on,disabled:r.disabled,onChange:function(){toggle(k);},onClick:function(e){e.stopPropagation();},"aria-label":(p.selectRowLabel||"Select row")+" "+(i+1)})):null,
        cols.map(function(c){ return h("td",{key:c.key,className:cx("aa-table__td",c.muted&&"is-muted",c.align&&"is-"+c.align)},c.render?c.render(r[c.key],r,i):r[c.key]); }));
    }):[h("tr",{key:"empty"},h("td",{className:"aa-table__empty",colSpan:cols.length+(p.selectable?1:0)},p.emptyText||"No data"))];
    return h("div",{className:cx("aa-table-wrap",p.className)},
      h("table",{className:cx("aa-table",p.onRowClick&&"aa-table--clickable")},
        p.caption?h("caption",{className:"aa-table__caption"},p.caption):null,
        h("thead",null,head),h("tbody",null,body)));
  }
  Object.assign(window.Aambience,{Table:Table}); })();
/* Header */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function Header(p){
    var logo = p.logo != null ? p.logo : (A.Logo ? h(A.Logo, { variant: "full", height: 54 }) : h("span", { className: "aa-header__logo-text" }, "Aambience"));
    var label = p.menuLabel != null ? p.menuLabel : "Menu";
    var showMenu = p.showMenu !== false;
    return h("header", { className: cx("aa-header", p.className) },
      h("div", { className: "aa-header__logo" }, logo),
      h("h1", { className: "aa-header__title" }, p.title != null ? p.title : "App title"),
      h("div", { className: "aa-header__actions" },
        p.actions || null,
        showMenu ? h("button", { type: "button", className: cx("aa-header__menu", p.menuOpen && "is-open"),
          "aria-haspopup": p.menuContent ? "menu" : undefined,
          "aria-expanded": p.menuContent ? !!p.menuOpen : undefined,
          onClick: p.onMenuClick },
          h("span", null, label), h(A.Icon, { name: "menu", size: 24 })) : null,
        p.menuOpen && p.menuContent ? h("div", { className: "aa-header__popover" }, p.menuContent) : null));
  }
  Object.assign(window.Aambience,{Header:Header}); })();
/* MenuItem */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function MenuItem(p){
    var size = p.size || "md", icon = p.icon == null ? "person" : p.icon;
    var active = p.active || p.state === "active";
    var rest = Object.assign({}, p);
    ["icon","label","size","state","active","className","children"].forEach(function(k){ delete rest[k]; });
    var label = p.label != null ? p.label : p.children;
    var iconNode = typeof icon === "string" ? h(A.Icon, { name: icon, size: 24 }) : icon;
    return h("button", Object.assign({ type: "button",
      "aria-current": active ? "page" : undefined,
      "aria-label": size === "sm" && typeof label === "string" ? label : undefined,
      title: size === "sm" && typeof label === "string" ? label : undefined }, rest, {
      className: cx("aa-menu-item", "aa-menu-item--" + size, active && "is-active", p.state === "hover" && "is-hover", p.className) }),
      h("span", { className: "aa-menu-item__icon" }, iconNode),
      size === "sm" ? null : h("span", { className: "aa-menu-item__label" }, label));
  }
  Object.assign(window.Aambience,{MenuItem:MenuItem}); })();
/* SubmenuItem */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function SubmenuItem(p){
    var size = p.size || "md";
    var rest = Object.assign({}, p);
    ["label","size","state","active","className","children"].forEach(function(k){ delete rest[k]; });
    return h("button", Object.assign({ type: "button", "aria-current": p.active ? "page" : undefined }, rest, {
      className: cx("aa-submenu-item", "aa-submenu-item--" + size, (p.state === "hover") && "is-hover", p.active && "is-active", p.className) }),
      h("span", { className: "aa-submenu-item__label" }, p.label != null ? p.label : p.children));
  }
  Object.assign(window.Aambience,{SubmenuItem:SubmenuItem}); })();
/* SideNav */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  function SideNav(p){
    var items = p.items || [], size = p.size || "md", subSize = p.submenuSize || "md";
    var st = R.useState(p.defaultOpenId != null ? p.defaultOpenId : null);
    var innerOpen = st[0], setInnerOpen = st[1];
    var controlled = p.openId !== undefined;
    var openId = controlled ? p.openId : innerOpen;
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = "aa-sidenav-" + (++uid);
    function setOpen(id){ if (!controlled) setInnerOpen(id); if (p.onOpenChange) p.onOpenChange(id); }
    function onKey(e){ if (e.key === "Escape" && openId != null) { setOpen(null); } }
    var logo = p.logo !== undefined ? p.logo : (A.Logo ? h(A.Logo, { variant: "mark", tone: "white", height: 40 }) : h("span", { className: "aa-sidenav__logo-text", "aria-hidden": "true" }, "A"));
    return h("nav", { className: cx("aa-sidenav", "aa-sidenav--" + size, p.className), "aria-label": p["aria-label"] || "Main", onKeyDown: onKey },
      logo ? h("div", { className: "aa-sidenav__logo" }, logo) : null,
      h("ul", { className: "aa-sidenav__list" }, items.map(function(it){
        var kids = it.children || [], has = kids.length > 0, open = has && openId === it.id;
        var panelId = idRef.current + "-" + it.id;
        return h("li", { key: it.id, className: "aa-sidenav__entry" },
          h(A.MenuItem, { icon: it.icon, label: it.label, size: size, active: p.activeId === it.id,
            "aria-expanded": has ? open : undefined, "aria-controls": has ? panelId : undefined,
            onClick: function(){ if (has) setOpen(open ? null : it.id); if (p.onSelect) p.onSelect(it.id, it); } }),
          open ? h("ul", { id: panelId, className: "aa-sidenav__flyout", "aria-label": typeof it.label === "string" ? it.label : undefined },
            kids.map(function(s){
              return h("li", { key: s.id },
                h(A.SubmenuItem, { label: s.label, size: subSize, active: p.activeSubId === s.id,
                  onClick: function(){ if (p.onSubSelect) p.onSubSelect(s.id, s, it); if (p.closeOnSelect !== false) setOpen(null); } }));
            })) : null);
      })));
  }
  Object.assign(window.Aambience,{SideNav:SideNav}); })();
/* MenuDropdown */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function MenuDropdown(p){
    var items = p.items || [];
    function onKey(e){
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var list = e.currentTarget.querySelectorAll(".aa-menu-dropdown__item");
      var i = Array.prototype.indexOf.call(list, document.activeElement);
      var n = e.key === "ArrowDown" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
      if (list[n]) { list[n].focus(); e.preventDefault(); }
    }
    return h("div", { role: "menu", "aria-label": p["aria-label"], className: cx("aa-menu-dropdown", p.className), onKeyDown: onKey },
      items.map(function(it){
        var active = it.active || (p.activeId != null && p.activeId === it.id);
        var icon = it.icon === undefined ? "person" : it.icon;
        return h("button", { key: it.id, type: "button", role: "menuitem", disabled: it.disabled,
          "aria-current": active ? "true" : undefined,
          className: cx("aa-menu-dropdown__item", active && "is-active"),
          onClick: function(e){ if (it.onClick) it.onClick(e); if (p.onSelect) p.onSelect(it.id, it); } },
          icon ? h("span", { className: "aa-menu-dropdown__icon" }, typeof icon === "string" ? h(A.Icon, { name: icon, size: 24 }) : icon) : null,
          h("span", { className: "aa-menu-dropdown__label" }, it.label));
      }));
  }
  Object.assign(window.Aambience,{MenuDropdown:MenuDropdown}); })();
/* DropdownItem */
(function(){ var R=window.React,h=R.createElement,A=window.Aambience;
  function cx(){ return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function DropdownItem(p){
    var items = p.items || [];
    var rows = items.map(function(it, i){
      var o = (it && typeof it === "object" && !R.isValidElement(it)) ? it : { label: it };
      var key = o.id != null ? o.id : i;
      var sel = o.selected || (p.selectedId != null && p.selectedId === o.id);
      return h("li", { key: key, role: "none" },
        h("button", { type: "button", role: "option", "aria-selected": sel ? "true" : "false", disabled: o.disabled,
          className: cx("aa-dropdown-item__row", sel && "is-selected"),
          onClick: function(e){ if (o.onClick) o.onClick(e); if (p.onSelect) p.onSelect(o.id != null ? o.id : i, o); } }, o.label));
    });
    return h("div", { className: cx("aa-dropdown-item", p.className) },
      p.header != null ? h("div", { className: "aa-dropdown-item__header" }, p.header) : null,
      rows.length ? h("ul", { className: "aa-dropdown-item__list", role: "listbox", "aria-label": typeof p.header === "string" ? p.header : p["aria-label"] }, rows) : null,
      p.children || null);
  }
  Object.assign(window.Aambience,{DropdownItem:DropdownItem}); })();
/* HistoryCard */
/* HistoryCard — Figma: Cards / History Card (20:426; View 20:427, hover 20:457, Edit 20:487) */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  function useId(prefix) { var r = R.useRef(null); if (!r.current) r.current = prefix + (++uid); return r.current; }
  function opts(list) {
    return (list || []).map(function (o) {
      var v = typeof o === "object" ? o.value : o, l = typeof o === "object" ? o.label : o;
      return h("option", { key: v, value: v }, l);
    });
  }
  function Select(p) {
    return h("div", { className: "aa-field" },
      h("label", { className: "aa-field__label", htmlFor: p.id }, p.label),
      h("div", { className: "aa-historycard__select" },
        h("select", { id: p.id, className: cx("aa-field__control", (p.value == null || p.value === "") && "is-empty"), value: p.value == null ? "" : p.value, onChange: p.onChange, disabled: p.disabled },
          h("option", { value: "", disabled: true }, p.placeholder || "Value"), opts(p.options)),
        h(A.Icon, { name: "expand-more", size: 24 })));
  }
  function Field(p) {
    return h("div", { className: "aa-historycard__field" },
      h("span", { className: "aa-historycard__label" }, p.label),
      h("span", { className: "aa-historycard__value" }, p.value == null || p.value === "" ? "—" : p.value));
  }
  function HistoryCard(p) {
    var mode = p.mode || "view", base = useId("aa-hist-");
    var set = function (k) { return function (e) { if (p.onChange) p.onChange(k, e.target.value); }; };
    if (mode === "edit") {
      return h("div", { className: cx("aa-historycard", "aa-historycard--edit", p.className), role: "group", "aria-label": p.ariaLabel || "Επεξεργασία επικοινωνίας" },
        h("div", { className: "aa-historycard__row" },
          h(A.TextInput, { className: "aa-historycard__col", label: "Ημερομηνία επικοινωνίας", placeholder: "00/00/0000", value: p.lastContact || "", onChange: set("lastContact") }),
          h("div", { className: "aa-historycard__col aa-historycard__contact" },
            h(Select, { id: base + "-contact", label: "Ονο/μο επαφής", value: p.contactName, options: p.contactOptions, onChange: set("contactName") }),
            h(A.Button, { color: "outline", className: "aa-historycard__add", leadingIcon: "add", "aria-label": "Νέα επαφή", onClick: p.onAddContact })),
          h("div", { className: "aa-historycard__col" },
            h(Select, { id: base + "-result", label: "Αποτέλεσμα", value: p.result, options: p.resultOptions, onChange: set("result") })),
          h(A.TextInput, { className: "aa-historycard__col", label: "Επόμενη επικοινωνία", placeholder: "00/00/0000", value: p.nextContact || "", onChange: set("nextContact") })),
        h(A.TextInput, { className: "aa-historycard__comment", label: "Σχόλιο", multiline: true, placeholder: "Enter text", value: p.comment || "", onChange: set("comment") }),
        (p.onSave || p.onCancel) ? h("div", { className: "aa-historycard__actions" },
          p.onCancel ? h(A.Button, { color: "outline", onClick: p.onCancel }, p.cancelLabel || "Ακύρωση") : null,
          p.onSave ? h(A.Button, { color: "main", onClick: p.onSave }, p.saveLabel || "Αποθήκευση") : null) : null);
    }
    return h("article", { className: cx("aa-historycard", p.state === "hover" && "is-hover", p.className) },
      h("div", { className: "aa-historycard__row" },
        h(Field, { label: "Τελευταία επικοινωνία", value: p.lastContact }),
        h(Field, { label: "Ονο/μο επαφής", value: p.contactName }),
        h(Field, { label: "Αποτέλεσμα", value: p.result }),
        h(Field, { label: "Επόμενη επικοινωνία", value: p.nextContact }),
        h("div", { className: "aa-historycard__tools" },
          p.onDelete ? h("button", { type: "button", className: "aa-historycard__tool", "aria-label": "Διαγραφή", onClick: p.onDelete }, h(A.Icon, { name: "delete", size: 24 })) : null,
          p.onEdit ? h("button", { type: "button", className: "aa-historycard__tool", "aria-label": "Επεξεργασία", onClick: p.onEdit }, h(A.Icon, { name: "edit", size: 24 })) : null)),
      p.comment != null ? h("div", { className: "aa-historycard__note" },
        h("span", { className: "aa-historycard__label aa-historycard__label--note" }, "Σχόλιο"),
        h("p", { className: "aa-historycard__comment-text" }, p.comment)) : null);
  }
  Object.assign(window.Aambience, { HistoryCard: HistoryCard });
})();
/* ContactCard */
/* ContactCard — Figma: Cards / Contact Card (20:507; View 20:508, Hover 20:542, Edit 20:576) */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var FIELDS = [
    { key: "firstName", label: "Όνομα", placeholder: "Enter text" },
    { key: "lastName", label: "Επώνυμο", placeholder: "Enter text" },
    { key: "mobile", label: "Κινητό", placeholder: "Enter number", type: "tel" },
    { key: "phone", label: "Σταθερό", placeholder: "Enter number", type: "tel" },
    { key: "extension", label: "Εσωτερικό", placeholder: "Enter number", inputMode: "numeric" },
    { key: "email", label: "eMail", placeholder: "Enter text", type: "email" }
  ];
  function ContactCard(p) {
    var mode = p.mode || "view";
    if (mode === "edit") {
      var input = function (f) {
        return h(A.TextInput, { key: f.key, className: "aa-contactcard__col", label: f.label, placeholder: f.placeholder,
          type: f.type || "text", inputMode: f.inputMode, value: p[f.key] || "",
          onChange: function (e) { if (p.onChange) p.onChange(f.key, e.target.value); } });
      };
      return h("div", { className: cx("aa-contactcard", "aa-contactcard--edit", p.className), role: "group", "aria-label": p.ariaLabel || "Επεξεργασία επαφής" },
        h("div", { className: "aa-contactcard__row" }, FIELDS.slice(0, 2).map(input)),
        h("div", { className: "aa-contactcard__row" }, FIELDS.slice(2).map(input)),
        (p.onSave || p.onCancel) ? h("div", { className: "aa-contactcard__actions" },
          p.onCancel ? h(A.Button, { color: "outline", onClick: p.onCancel }, p.cancelLabel || "Ακύρωση") : null,
          p.onSave ? h(A.Button, { color: "main", onClick: p.onSave }, p.saveLabel || "Αποθήκευση") : null) : null);
    }
    return h("article", { className: cx("aa-contactcard", p.state === "hover" && "is-hover", p.className) },
      h("dl", { className: "aa-contactcard__fields" },
        FIELDS.map(function (f) {
          var v = p[f.key];
          return h("div", { key: f.key, className: "aa-contactcard__field" },
            h("dt", { className: "aa-contactcard__label" }, f.label),
            h("dd", { className: "aa-contactcard__value" },
              v == null || v === "" ? "—" :
              f.key === "email" ? h("a", { href: "mailto:" + v }, v) :
              (f.key === "mobile" || f.key === "phone") ? h("a", { href: "tel:" + v }, v) : v));
        })),
      h("div", { className: "aa-contactcard__tools" },
        p.onDelete ? h("button", { type: "button", className: "aa-contactcard__tool", "aria-label": "Διαγραφή επαφής", onClick: p.onDelete }, h(A.Icon, { name: "delete", size: 24 })) : null,
        p.onEdit ? h("button", { type: "button", className: "aa-contactcard__tool", "aria-label": "Επεξεργασία επαφής", onClick: p.onEdit }, h(A.Icon, { name: "edit", size: 24 })) : null));
  }
  Object.assign(window.Aambience, { ContactCard: ContactCard });
})();
/* CompanyCard */
/* CompanyCard — Figma: Cards / Company card (20:598; Default 20:599, hover 20:613, active 20:627, Edit 20:641) */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  function CompanyCard(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = "aa-company-" + (++uid);
    var id = idRef.current, mode = p.mode || "view";
    if (mode === "edit") {
      var empty = p.category == null || p.category === "";
      return h("div", { className: cx("aa-companycard", "aa-companycard--edit", p.className), role: "group", "aria-label": p.ariaLabel || "Επεξεργασία εταιρείας" },
        h(A.TextInput, { label: "Όνομα εταιρείας", placeholder: "Enter text", value: p.name || "",
          onChange: function (e) { if (p.onChange) p.onChange("name", e.target.value); } }),
        h("div", { className: "aa-field aa-companycard__category" },
          h("label", { className: "aa-field__label", htmlFor: id + "-cat" }, "Κατηγορία"),
          h("div", { className: "aa-companycard__select" },
            h("select", { id: id + "-cat", className: cx("aa-field__control", empty && "is-empty"), value: empty ? "" : p.category,
              onChange: function (e) { if (p.onChange) p.onChange("category", e.target.value); } },
              h("option", { value: "", disabled: true }, "Value"),
              (p.categoryOptions || []).map(function (o) {
                var v = typeof o === "object" ? o.value : o;
                return h("option", { key: v, value: v }, typeof o === "object" ? o.label : o);
              })),
            h(A.Icon, { name: "expand-more", size: 24 }))),
        (p.onSave || p.onCancel) ? h("div", { className: "aa-companycard__actions" },
          p.onCancel ? h(A.Button, { color: "outline", onClick: p.onCancel }, p.cancelLabel || "Ακύρωση") : null,
          p.onSave ? h(A.Button, { color: "main", onClick: p.onSave }, p.saveLabel || "Αποθήκευση") : null) : null);
    }
    var body = [
      h("span", { key: "n", className: "aa-companycard__name" }, p.name),
      p.category ? h("span", { key: "c", className: "aa-companycard__category-text" }, p.category) : null,
      (p.date || p.status) ? h("span", { key: "m", className: "aa-companycard__meta" },
        p.date ? h("span", { className: "aa-companycard__date" }, p.date) : null,
        p.status ? h("span", { className: "aa-companycard__status" }, p.status) : null) : null
    ];
    return h("article", { className: cx("aa-companycard", p.active && "is-active", p.state === "hover" && "is-hover", p.className) },
      p.onClick
        ? h("button", { type: "button", className: "aa-companycard__main", onClick: p.onClick, "aria-pressed": p.active ? "true" : "false" }, body)
        : h("div", { className: "aa-companycard__main" }, body),
      (p.onDelete || p.onEdit) ? h("div", { className: "aa-companycard__tools" },
        p.onDelete ? h("button", { type: "button", className: "aa-companycard__tool", "aria-label": "Διαγραφή εταιρείας", onClick: p.onDelete }, h(A.Icon, { name: "delete", size: 24 })) : null,
        p.onEdit ? h("button", { type: "button", className: "aa-companycard__tool", "aria-label": "Επεξεργασία εταιρείας", onClick: p.onEdit }, h(A.Icon, { name: "edit", size: 24 })) : null) : null);
  }
  Object.assign(window.Aambience, { CompanyCard: CompanyCard });
})();
/* EntranceCard */
/* EntranceCard — Figma: Cards / Entrance card (symbol 20:860) */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function Meta(p) {
    if (p.value == null || p.value === "") return null;
    return h("span", { className: "aa-entrancecard__meta" },
      h(A.Icon, { name: p.icon, size: 24 }),
      h("span", { className: "aa-entrancecard__sr" }, p.label + ": "),
      h("span", null, p.value));
  }
  function EntranceCard(p) {
    return h("article", { className: cx("aa-entrancecard", p.className), "aria-label": p.name },
      h("div", { className: "aa-entrancecard__top" },
        h("span", { className: "aa-entrancecard__who" },
          h(A.Icon, { name: "person", size: 24 }),
          h("span", { className: "aa-entrancecard__name" }, p.name)),
        p.time ? h("span", { className: "aa-entrancecard__meta" },
          h(A.Icon, { name: "exit", size: 24 }),
          h("span", { className: "aa-entrancecard__sr" }, "Είσοδος: "),
          h("time", { dateTime: p.dateTime }, p.time)) : null),
      h("div", { className: "aa-entrancecard__bottom" },
        h("div", { className: "aa-entrancecard__details" },
          p.onInfo
            ? h("button", { type: "button", className: "aa-entrancecard__info", "aria-label": "Πληροφορίες επισκέπτη", onClick: p.onInfo }, h(A.Icon, { name: "info", size: 24 }))
            : h("span", { className: "aa-entrancecard__info", "aria-hidden": "true" }, h(A.Icon, { name: "info", size: 24 })),
          h(Meta, { icon: "business", label: "Όροφος", value: p.floor }),
          h(Meta, { icon: "parking", label: "Θέση στάθμευσης", value: p.parking }),
          h(Meta, { icon: "car", label: "Πινακίδα", value: p.plate })),
        p.onExit !== null ? h(A.Button, { color: "error", roundness: "none", className: "aa-entrancecard__exit", onClick: p.onExit, disabled: p.exitDisabled }, p.exitLabel || "Exit") : null));
  }
  Object.assign(window.Aambience, { EntranceCard: EntranceCard });
})();
/* DayCard */
/* DayCard — Figma: Cards / Month-Calendar date (20:646; Default 20:647, hover 20:667, Variant3 = highlighted 20:657) */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function DayCard(p) {
    var names = p.names || [], max = p.maxNames == null ? 2 : p.maxNames;
    var shown = names.slice(0, max);
    var more = p.more != null ? p.more : Math.max(0, names.length - max);
    var dayText = typeof p.day === "number" && p.day < 10 ? "0" + p.day : p.day;
    var body = [
      h("span", { key: "d", className: "aa-daycard__day" }, dayText),
      h("span", { key: "n", className: "aa-daycard__names" },
        shown.map(function (n, i) { return h("span", { key: i, className: "aa-daycard__name" }, n); })),
      more > 0 ? h("span", { key: "m", className: "aa-daycard__more" }, p.moreLabel || ("+" + more + " ακόμα")) : h("span", { key: "m", className: "aa-daycard__more aa-daycard__more--empty", "aria-hidden": "true" })
    ];
    var label = p.ariaLabel || (String(dayText) + (names.length ? ", " + names.length + " άτομα" : ""));
    return h("div", { className: cx("aa-daycard", p.highlighted && "is-highlighted", p.state === "hover" && "is-hover", p.className) },
      p.onClick
        ? h("button", { type: "button", className: "aa-daycard__main", onClick: p.onClick, "aria-label": label, "aria-current": p.highlighted ? "date" : undefined }, body)
        : h("div", { className: "aa-daycard__main", "aria-label": label, role: "group" }, body),
      p.onEdit ? h("button", { type: "button", className: "aa-daycard__edit", "aria-label": "Επεξεργασία " + dayText, onClick: p.onEdit }, h(A.Icon, { name: "edit", size: 24 })) : null);
  }
  Object.assign(window.Aambience, { DayCard: DayCard });
})();
/* ConfirmationDialog */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  function ConfirmationDialog(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = "aa-confirm-" + (++uid);
    var theme = p.theme === "light" ? "light" : "dark";
    var showIcon = p.showIcon !== false;
    var msgId = idRef.current + "-msg";
    var Btn = A.Button;
    function btn(color, label, onClick, cls) {
      if (Btn) return h(Btn, { color: color, onClick: onClick, className: cls }, label);
      return h("button", { type: "button", className: cls, onClick: onClick }, label);
    }
    return h("div", { role: "alertdialog", "aria-modal": p.modal ? "true" : undefined, "aria-labelledby": msgId,
        className: cx("aa-confirm", "aa-confirm--" + theme, p.className) },
      showIcon ? h("div", { className: "aa-confirm__icon", "aria-hidden": "true" },
        A.Icon ? h(A.Icon, { name: p.icon || "check", size: 96 }) : null) : null,
      h("p", { id: msgId, className: "aa-confirm__message" }, p.message != null ? p.message : p.children),
      h("div", { className: "aa-confirm__actions" },
        btn("error", p.cancelLabel || "Cancel", p.onCancel, "aa-confirm__btn"),
        btn("main", p.confirmLabel || "Confirm", p.onConfirm, "aa-confirm__btn")));
  }
  Object.assign(window.Aambience, { ConfirmationDialog: ConfirmationDialog });
})();
/* Modal */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  function Modal(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = "aa-modal-" + (++uid);
    var titleId = idRef.current + "-title";
    var size = p.size === "lg" ? "lg" : "sm";
    var align = p.footerAlign || (size === "lg" ? "end" : "stretch");
    var style = p.width != null ? { width: typeof p.width === "number" ? p.width + "px" : p.width } : undefined;
    return h("div", { role: "dialog", "aria-modal": p.modal ? "true" : undefined, "aria-labelledby": titleId,
        className: cx("aa-modal", "aa-modal--" + size, p.className), style: style },
      h("div", { className: "aa-modal__header" },
        h("h2", { id: titleId, className: "aa-modal__title" }, p.title),
        p.onClose ? h("button", { type: "button", className: "aa-modal__close", "aria-label": p.closeLabel || "Close", onClick: p.onClose },
          A.Icon ? h(A.Icon, { name: "close", size: 24 }) : "×") : null),
      h("div", { className: "aa-modal__body" }, p.children),
      p.footer ? h("div", { className: cx("aa-modal__footer", "aa-modal__footer--" + align) }, p.footer) : null);
  }
  Object.assign(window.Aambience, { Modal: Modal });
})();
/* StatusBadge */
(function () {
  var R = window.React, h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var LABELS = { scheduled: "Default", expiring: "Warning", passed: "Confirm", failed: "Error" };
  function StatusBadge(p) {
    var status = LABELS[p.status] ? p.status : "scheduled";
    return h("span", { className: cx("aa-badge", "aa-badge--" + status, p.className), title: p.title },
      p.children != null ? p.children : LABELS[status]);
  }
  Object.assign(window.Aambience, { StatusBadge: StatusBadge });
})();
/* CertificationRow */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function CertificationRow(p) {
    var badge = A.StatusBadge ? h(A.StatusBadge, { status: p.status }, p.badgeLabel)
      : h("span", { className: "aa-certrow__badge" }, p.badgeLabel || p.status);
    var Tag = p.onClick ? "button" : "div";
    return h(Tag, { type: p.onClick ? "button" : undefined, onClick: p.onClick,
        className: cx("aa-certrow", p.onClick && "aa-certrow--interactive", p.className) },
      h("span", { className: "aa-certrow__name" }, p.name),
      h("span", { className: "aa-certrow__meta" },
        h("span", { className: "aa-certrow__cert" }, p.certificate),
        badge));
  }
  Object.assign(window.Aambience, { CertificationRow: CertificationRow });
})();
/* DeviceCard */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var uid = 0;
  var TONES = ["primary", "fifth"];
  function Donut(p) {
    var r = 16.5, c = 2 * Math.PI * r, pct = Math.max(0, Math.min(100, Number(p.percent) || 0));
    return h("svg", { className: "aa-device__donut aa-device__donut--" + p.tone, width: 40, height: 40, viewBox: "0 0 40 40", "aria-hidden": "true", focusable: "false" },
      h("circle", { className: "aa-device__donut-track", cx: 20, cy: 20, r: r, fill: "none", strokeWidth: 7 }),
      h("circle", { className: "aa-device__donut-fill", cx: 20, cy: 20, r: r, fill: "none", strokeWidth: 7,
        strokeDasharray: (c * pct / 100) + " " + c, transform: "rotate(-90 20 20)" }));
  }
  function DeviceCard(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = "aa-device-" + (++uid);
    var controlled = p.sliderValue != null;
    var st = R.useState(p.defaultSliderValue != null ? p.defaultSliderValue : 30);
    var val = controlled ? p.sliderValue : st[0];
    var min = p.sliderMin != null ? p.sliderMin : 0, max = p.sliderMax != null ? p.sliderMax : 100;
    function onSlide(e) {
      var v = Number(e.target.value);
      if (!controlled) st[1](v);
      if (p.onSliderChange) p.onSliderChange(v);
    }
    var metrics = p.metrics || [];
    var sliderId = idRef.current + "-slider";
    var fillPct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    var number = p.number != null ? p.number : "00";
    return h("article", { className: cx("aa-device", p.className), "aria-label": typeof p.computerName === "string" ? p.computerName : undefined },
      h("header", { className: "aa-device__head" },
        h("span", { className: "aa-device__num" }, number),
        h("span", { className: "aa-device__name" }, p.computerName),
        h("span", { className: "aa-device__title" }, p.title)),
      h("div", { className: "aa-device__body" },
        metrics.length ? h("div", { className: "aa-device__metrics" }, metrics.map(function (m, i) {
          var tone = m.tone || TONES[i % TONES.length];
          return h("div", { key: i, className: "aa-device__metric" },
            h("span", { className: "aa-device__data" },
              h("span", null, m.label),
              h("b", null, m.value != null && m.total != null ? m.value + "/" + m.total : m.value)),
            h("span", { className: "aa-device__pct", role: "img", "aria-label": (typeof m.label === "string" ? m.label + " " : "") + m.percent + "%" },
              h(Donut, { percent: m.percent, tone: tone }),
              h("span", { className: "aa-device__pct-text", "aria-hidden": "true" }, m.percent + "%")));
        })) : null,
        p.onExtract !== null ? h("button", { type: "button", className: "aa-device__extract", onClick: p.onExtract, disabled: p.extractDisabled },
          A.Icon ? h(A.Icon, { name: "description", size: 24 }) : null,
          h("span", null, p.extractLabel || "Extract Report")) : null),
      p.hideSlider ? null : h("div", { className: "aa-device__slider" },
        h("input", { id: sliderId, type: "range", min: min, max: max, step: p.sliderStep || 1, value: val, onChange: onSlide,
          "aria-label": p.sliderLabel || "Value", className: "aa-device__range", style: { "--aa-fill": fillPct + "%" } }),
        h("output", { htmlFor: sliderId, className: "aa-device__value" }, val)));
  }
  Object.assign(window.Aambience, { DeviceCard: DeviceCard });
})();
/* MonthCalendar */
(function () {
  var R = window.React, h = R.createElement, A = window.Aambience;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  var MONTHS = ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"];
  var DAYS_FULL = ["ΔΕΥΤΕΡΑ", "ΤΡΙΤΗ", "ΤΕΤΑΡΤΗ", "ΠΕΜΠΤΗ", "ΠΑΡΑΣΚΕΥΗ", "ΣΑΒΒΑΤΟ", "ΚΥΡΙΑΚΗ"];
  var DAYS_SHORT = ["Δ", "Τ", "Τ", "Π", "Π", "Σ", "Κ"];
  var DAYS_ARIA = ["Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function buildWeeks(year, month) {
    var first = new Date(year, month - 1, 1);
    var lead = (first.getDay() + 6) % 7;
    var dim = new Date(year, month, 0).getDate();
    var prevDim = new Date(year, month - 1, 0).getDate();
    var cells = [], i;
    for (i = lead; i > 0; i--) cells.push({ day: prevDim - i + 1, out: true, offset: -1 });
    for (i = 1; i <= dim; i++) cells.push({ day: i, out: false, offset: 0 });
    var n = 1; while (cells.length % 7) cells.push({ day: n++, out: true, offset: 1 });
    var weeks = []; for (i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }
  function MonthCalendar(p) {
    var now = new Date();
    var year = p.year != null ? p.year : now.getFullYear();
    var month = p.month != null ? p.month : now.getMonth() + 1;
    var compact = p.variant === "compact";
    var events = p.events || {};
    var maxVisible = p.maxVisible != null ? p.maxVisible : 2;
    var selected = p.selectedDays || null;
    var label = p.title != null ? p.title : MONTHS[month - 1] + " " + year;
    var weeks = buildWeeks(year, month);
    var heads = compact ? DAYS_SHORT : DAYS_FULL;
    function evFor(c) {
      if (c.out) return p.outsideEvents && p.outsideEvents[(c.offset < 0 ? "prev" : "next") + ":" + c.day] || [];
      return events[c.day] || [];
    }
    function isHi(c) {
      if (c.out) return false;
      if (selected) return selected.indexOf(c.day) !== -1;
      return compact && (events[c.day] || []).length > 0;
    }
    function dateOf(c) { return new Date(year, month - 1 + c.offset, c.day); }
    function cell(c, col) {
      var list = evFor(c), weekend = col >= 5, hi = isHi(c);
      var aria = c.day + " " + (c.out ? "" : MONTHS[month - 1]) + (list.length ? ", " + list.length + " εγγραφές" : "");
      var cls = cx("aa-cal__cell", weekend && "is-weekend", c.out && "is-outside", hi && "is-selected");
      var content;
      if (compact) {
        content = h("span", { className: "aa-cal__date" }, pad(c.day));
      } else {
        var shown = list.slice(0, maxVisible), more = list.length - shown.length;
        content = [
          h("span", { key: "d", className: "aa-cal__date" }, pad(c.day)),
          shown.length ? h("span", { key: "e", className: "aa-cal__events" }, shown.map(function (e, i) {
            return h("span", { key: i, className: "aa-cal__event" }, typeof e === "object" && e && !R.isValidElement(e) ? e.name : e);
          })) : null,
          more > 0 ? h(p.onMoreClick ? "button" : "span", { key: "m", className: "aa-cal__more", type: p.onMoreClick ? "button" : undefined,
            onClick: p.onMoreClick ? function (ev) { ev.stopPropagation(); p.onMoreClick(dateOf(c), list); } : undefined },
            "+" + more + " " + (p.moreLabel || "ακόμα")) : null
        ];
      }
      var key = c.offset + ":" + c.day;
      if (p.onSelectDay) {
        return h("div", { key: key, role: "gridcell", className: "aa-cal__slot" },
          h("button", { type: "button", className: cls + " aa-cal__cell--btn", "aria-label": aria, "aria-pressed": hi ? "true" : "false",
            onClick: function () { p.onSelectDay(dateOf(c), list); } }, content));
      }
      return h("div", { key: key, role: "gridcell", className: cls, "aria-label": aria }, content);
    }
    var nav = function (dir, fn) {
      return fn ? h("button", { type: "button", className: "aa-cal__nav", onClick: fn, "aria-label": dir < 0 ? "Προηγούμενος μήνας" : "Επόμενος μήνας" },
        A.Icon ? h(A.Icon, { name: dir < 0 ? "chevron-left" : "chevron-right", size: 24 }) : (dir < 0 ? "<" : ">")) : h("span", { className: "aa-cal__nav-spacer" });
    };
    return h("div", { className: cx("aa-cal", compact ? "aa-cal--compact" : "aa-cal--full", p.className) },
      h("div", { className: "aa-cal__header" }, nav(-1, p.onPrev), h("h2", { className: "aa-cal__title" }, label), nav(1, p.onNext)),
      h("div", { role: "grid", "aria-label": label, className: "aa-cal__grid" },
        h("div", { role: "row", className: "aa-cal__row aa-cal__row--head" }, heads.map(function (d, i) {
          return h("div", { key: i, role: "columnheader", className: "aa-cal__weekday", "aria-label": DAYS_ARIA[i] }, d);
        })),
        weeks.map(function (w, wi) {
          return h("div", { key: wi, role: "row", className: "aa-cal__row" }, w.map(cell));
        })));
  }
  Object.assign(window.Aambience, { MonthCalendar: MonthCalendar });
})();
