import PrinterComponent from './Printer'

const Printer = {};

Printer.install = function (Vue) {
    const PrinterConstructor = Vue.extend(PrinterComponent);
    const printerInstance = new PrinterConstructor();
    const printerElement = printerInstance.$mount();

    document.body.appendChild(printerElement.$el);

    Vue.prototype.$printer = printerInstance;
    Vue.prototype.$print = printerInstance.print;
};

export default Printer;