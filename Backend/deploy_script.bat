cd /d %~dp0 && ^
npx sequelize-cli db:migrate && ^
cd bulk && ^
node start.js && ^
cd .. && ^
cd scripts && ^
node importData.js && ^
node updateAllEmployees.js && ^
node getFingerPrintId.js


