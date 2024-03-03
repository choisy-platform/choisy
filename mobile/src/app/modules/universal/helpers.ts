interface String {
  format(...replacements: any[]): string;
}

if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

interface Array<T> {
  groupBy<T>(func: (x: T) => string);
}
Array.prototype.groupBy = function (funcProp) {
  return this.reduce(function (acc, val) {
    (acc[funcProp(val)] = acc[funcProp(val)] || []).push(val);
    return acc;
  }, {});
};

interface Date {
  toUTC(): Date;
}

if (!Date.prototype.toUTC) {
  Date.prototype.toUTC = function () {
    return new Date(
      this.getUTCFullYear(),
      this.getUTCMonth(),
      this.getUTCDate(),
      this.getUTCHours(),
      this.getUTCMinutes(),
      this.getUTCSeconds()
    );
  };
}
