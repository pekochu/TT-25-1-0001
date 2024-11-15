/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData, PagesToTrack, UserMagicTokens, ScheduledTrackingResults } from '@project/server/app/models';
//
const dbInit = async (): Promise<[any, any, any]> => Promise.all([
  UserData.sync({ alter: true }),
  PagesToTrack.sync({ alter: true }),
  // UserMagicTokens.sync({ alter: true }),
  ScheduledTrackingResults.sync({ alter: true })
]);
// Tokens para usuarios
// UserData.hasMany(UserMagicTokens, { sourceKey: 'id', foreignKey: 'userId', onDelete: 'SET NULL' });
// UserMagicTokens.belongsTo(UserData, { foreignKey: 'userId' });
// Paginas para usuarios
UserData.hasMany(PagesToTrack, { foreignKey: 'userId', as: 'managingPages', onDelete: 'SET NULL' });
PagesToTrack.belongsTo(UserData, { foreignKey: 'userId', as: 'managedPagesUserData' });
// Resultados para paginas
PagesToTrack.hasMany(ScheduledTrackingResults, { foreignKey: 'pagesToTrackId', as: 'managedPagesResults', onDelete: 'SET NULL' });
ScheduledTrackingResults.belongsTo(PagesToTrack, { foreignKey: 'pagesToTrackId', as: 'resultsPage' });
// Resultados para usuarios
UserData.hasMany(ScheduledTrackingResults, { foreignKey: 'userId', as: 'resultsUserData', onDelete: 'SET NULL' });
ScheduledTrackingResults.belongsTo(UserData, { foreignKey: 'userId', as: 'userResults' });
export default dbInit; 