// Convert functions are from: https://github.com/behnam/jalali-gcal


function toJalali(date, separator) {
    if (date == undefined) {
        date = new Date();
    }

    if(separator == undefined) {
        separator = '-';
    }

    res = gregorianArrayToJalali([date.getYear(), date.getMonth() + 1, date.getDate()]);  // only getMonth() starts from zero
    return res[0] + separator + res[1] + separator + res[2];
}


div = function (a, b) { return Math.floor(a / b); };
gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];


function gregorianArrayToJalali(g)
// input: array containing gregorian date [year, month, day]
// output: array containing jalali date [year, month, day]
{

    var gy, gm, gd, g_day_no;
    var jy, jm, jd, j_day_no, j_np;

    var i;

    gy = g[0] - 1600;
    gm = g[1] - 1;
    gd = g[2] - 1;

    // calculating g_day_no
    g_day_no = 365 * gy + this.div((gy + 3), 4) - this.div((gy + 99), 100) + this.div((gy + 399), 400);

    for (i = 0; i < gm; ++i)
        g_day_no += this.gDaysInMonth[i];

    if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
        ++g_day_no;						// leap and after Feb

    g_day_no += gd;

    // calculating j_day_no, etc
    j_day_no = g_day_no - 79;

    j_np = this.div(j_day_no, 12053);
    j_day_no %= 12053;

    jy = 979 + 33 * j_np + 4 * this.div(j_day_no, 1461);
    j_day_no %= 1461;

    if (j_day_no >= 366) {
        jy += this.div((j_day_no - 1), 365);
        j_day_no = (j_day_no - 1) % 365;
    }

    for (i = 0; i < 11 && j_day_no >= this.jDaysInMonth[i]; ++i) {
        j_day_no -= this.jDaysInMonth[i];
    }

    jm = i + 1;
    jd = j_day_no + 1;

    return [jy, jm, jd];
}

this.jalaliArrayToGregorian = function (j)
// input: array containing jalali date [year, month, day]
// output: array containing gregorian date [year, month, day]
{
    var gy, gm, gd;
    var jy, jm, jd;
    var g_day_no, j_day_no;
    var leap;

    var i;

    jy = j[0] - 979;
    jm = j[1] - 1;
    jd = j[2] - 1;

    // calculating j_day_no
    j_day_no = 365 * jy + this.div(jy, 33) * 8 + this.div((jy % 33 + 3), 4);
    for (i = 0; i < jm; ++i)
        j_day_no += this.jDaysInMonth[i];

    j_day_no += jd;

    // calculating g_day_no, etc
    g_day_no = j_day_no + 79;

    gy = 1600 + 400 * this.div(g_day_no, 146097);	// 146097 = 365*400 + 400/4 - 400/100 + 400/400
    g_day_no = g_day_no % 146097;

    leap = 1;
    if (g_day_no >= 36525)				// 36525 = 365*100 + 100/4
    {
        g_day_no--;
        gy += 100 * this.div(g_day_no, 36524);		// 36524 = 365*100 + 100/4 - 100/100
        g_day_no = g_day_no % 36524;

        if (g_day_no >= 365)
            g_day_no++;
        else
            leap = 0;
    }

    gy += 4 * this.div(g_day_no, 1461);		// 1461 = 365*4 + 4/4
    g_day_no %= 1461;

    if (g_day_no >= 366) {
        leap = 0;

        g_day_no--;
        gy += this.div(g_day_no, 365);
        g_day_no = g_day_no % 365;
    }

    for (i = 0; g_day_no >= this.gDaysInMonth[i] + (i == 1 && leap); i++)
        g_day_no -= this.gDaysInMonth[i] + (i == 1 && leap);

    gm = i + 1;
    gd = g_day_no + 1;

    return [gy, gm, gd];
}
