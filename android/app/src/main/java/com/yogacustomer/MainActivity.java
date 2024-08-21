<<<<<<< HEAD
package com.yogacustomer;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);
      super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "YogaCustomer";
  }
}
=======
package com.yogacustomer;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);
      super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "YogaCustomer";
  }
}
>>>>>>> 5d7e46d54251c7d169a76977d2fb87a9f9216716
