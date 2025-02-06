import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteAuthUsers = functions.https.onCall(async (data, context) => {
  // 管理者権限のチェック
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', '管理者権限が必要です');
  }

  const { userIds } = data;
  if (!Array.isArray(userIds)) {
    throw new functions.https.HttpsError('invalid-argument', 'userIdsは配列である必要があります');
  }

  try {
    // 一括削除を実行
    const deletePromises = userIds.map(uid => admin.auth().deleteUser(uid));
    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error('ユーザーの削除に失敗しました:', error);
    throw new functions.https.HttpsError('internal', 'ユーザーの削除に失敗しました');
  }
}); 