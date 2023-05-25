/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData, PagesToTrack, UserMagicTokens, ScheduledTrackingResults } from '@project/server/app/models';
//
const dbInit = (): Promise<[any, any, any, any]> => Promise.all([
  UserData.sync({ alter: true }),
  PagesToTrack.sync({ alter: true }),
  UserMagicTokens.sync({ alter: true }),
  ScheduledTrackingResults.sync({ alter: true })
]);
// Tokens para usuarios
UserData.hasMany(UserMagicTokens, { sourceKey: 'id', foreignKey: 'userId'});
UserMagicTokens.belongsTo(UserData, { foreignKey: 'userId' });
// Paginas para usuarios
UserData.hasMany(PagesToTrack, { sourceKey: 'id', foreignKey: 'userId'});
PagesToTrack.belongsTo(UserData, { foreignKey: 'userId' });
// Resultados para paginas
PagesToTrack.hasMany(ScheduledTrackingResults, { sourceKey: 'id', foreignKey: 'pagesToTrackId'});
ScheduledTrackingResults.belongsTo(PagesToTrack, { foreignKey: 'pagesToTrackId' });
// Resultados para usuarios
UserData.hasMany(ScheduledTrackingResults, { sourceKey: 'id', foreignKey: 'userId'});
ScheduledTrackingResults.belongsTo(UserData, { foreignKey: 'userId' });
export default dbInit; 