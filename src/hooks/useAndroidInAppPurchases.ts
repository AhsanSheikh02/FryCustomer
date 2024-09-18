import moment from 'moment';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import * as RNIap from 'react-native-iap';
import {
  initConnection,
  PurchaseError,
  requestSubscription,
  useIAP,
} from 'react-native-iap';

const useInAppPurchasesAndroid = () => {
  const subscriptionSkus = [
    'com.yogacustomer.1month',
    'com.yogacustomer.3month',
    'com.yogacustomer.1year',
  ];
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory,
    getPurchaseHistory,
    availablePurchases,
    getAvailablePurchases,
  } = useIAP();


  useEffect(() => {
    initializeIAP();
  }, []);

  useEffect(() => {
    handleGetPurchaseHistory();
    handleGetSubscriptions();
  }, [connected]);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase: any) => {
      if (purchase) {
        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            await RNIap.acknowledgePurchaseAndroid({
              token: purchase.purchaseToken,
            });
            RNIap.finishTransaction({purchase}).then(() => {
              console.log('finishTransaction');
              getCurrentSubscriptions().then(subscription => {
                if (subscription && subscription.transactionReceipt) {
                  handleFinalizingSubscriptions(subscription);
                }
              });
            });
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const handleFinalizingSubscriptions = async (subscription: any) => {
    if (subscription && subscription.transactionReceipt) {
      try {
        const receipt = JSON.parse(subscription.transactionReceipt);
        const purchaseTime = receipt.purchaseTime;

        if (subscription.autoRenewingAndroid === true) {
          Alert.alert(
            'Subscription Status',
            `You have an active subscription purchase Time is ${moment(
              purchaseTime,
            ).format('MMMM Do YYYY h:mm:ss a')}.`,
          );
        } else {
          Alert.alert(
            'Subscription Status',
            `Your subscription has been canceled. purchase Time is ${moment(
              purchaseTime,
            ).format('MMMM Do YYYY h:mm:ss a')}.`,
          );
        }
      } catch (error) {
        console.error('Error parsing transactionReceipt:', error);
      }
    }
  };

  useEffect(() => {
    getCurrentSubscriptions().then(subscription => {
      if (subscription && subscription.transactionReceipt) {
        handleFinalizingSubscriptions(subscription);
      }
    });
  }, []);

  const getCurrentSubscriptions = async () => {
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    const availablePurchases = await RNIap.getAvailablePurchases();

    if (availablePurchases.length < 1) return null; // Return null instead of empty array

    const lastPurchase = availablePurchases[0];

    console.log('lastPurchase: ', lastPurchase.transactionReceipt);

    return lastPurchase;
  };

  const errorLog = ({message, error}: {message: string; error: any}) => {
    console.error('An error happened', message, error);
  };

  const initializeIAP = async () => {
    try {
      await initConnection();
    } catch (error) {
      console.log('Error initializing IAP:', error);
    }
  };

  const handleGetPurchaseHistory = async () => {
    try {
      getPurchaseHistory();
    } catch (error) {
      errorLog({message: 'handleGetPurchaseHistory', error});
    }
  };

  const handleGetSubscriptions = async () => {
    try {
      RNIap.getSubscriptions({
        skus: subscriptionSkus,
      }).then(ss => {
        ss.forEach(s => console.log({s}));
      });

      const test = await getSubscriptions({skus: subscriptionSkus});
      console.log('test: ', test);
    } catch (error) {
      errorLog({message: 'ERROR', error});
    }
  };

  const handlePurchaseSubscription = async (
    sku: string,
    offerToken: string,
  ) => {
    try {
      const subscriptionRequest = {
        sku: sku,
        subscriptionOffers: [
          {
            sku,
            offerToken,
          },
        ],
      };
      await requestSubscription(subscriptionRequest);
    } catch (error) {
      console.log('error: ', JSON.stringify(error));
      if (error instanceof PurchaseError) {
        errorLog({message: `[${error.code}]: ${error.message}`, error});
      } else {
        errorLog({message: 'handleBuySubscription', error});
      }
    }
  };

  return {
    handlePurchaseSubscription,
  };
};

export default useInAppPurchasesAndroid;
