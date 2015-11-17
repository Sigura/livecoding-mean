'use strict';

const defaultLang = 'en';
let lang = defaultLang;//navigator.language || navigator.browserLanguage;

const locales = [{
    lang: 'en',
    locales: 'en-US',
    formats: {
        number: {
            USD: {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        }
    },
    messages: {
        Date: 'Date',
        LoginFormTitle: 'Please sign in or register',
        Expenses: 'Expenses',
        Total: '{length, plural, one{# expense} other{# expenses}}, Sum:{sum, number, USD}, AVG: {avg, number, USD}, AVG by day:{dayAvg, number, USD}({days}), by week:{weekAvg, number, USD}({weeks}), by month:{monthAvg, number, USD}({months}), by year:{yearAvg, number, USD}({years})',
        expenseDeleted: 'Expense deleted',
        expensesLoaded: 'Expenses data loaded',
        expenseInserted: 'Expense inserted',
        expenseUpdated: 'Expense updated',
        Error: '{error}{errorName}{errorPassword}'
    }
},
{
    lang: 'ru',
    locales: 'ru-RU',
    formats: {
        number: {
            USD: {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        }
    },
    messages: {
        Date: 'Дата',
        LoginFormTitle: 'Войдите или зарегистрируйтесь',
        Expenses: 'Расходы',
        Total: '{length, plural, one{# запись} other{# записи}}, Сумма:{sum, number, USD}, Среднее за день:{dayAvg, number, USD}, в неделю:{weekAvg, number, USD}, в месяц:{monthAvg, number, USD}, в год:{yearAvg, number, USD}'
    }
}];

const filter = item => item.lang === lang;
const isSupported = locales.filter(filter).length;

lang = isSupported ? lang : defaultLang;

const data = locales.filter(filter).shift();

export default data;
