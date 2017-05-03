// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 >= id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 2";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 1";
outputs[8] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[9] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[10] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 0";
outputs[11] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 0";
outputs[12] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[13] = "id4_R_t2: 2;id5_R_t2: 1;id6_R_t2: 0";
outputs[14] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[15] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[16] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 2";
outputs[17] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 2";
outputs[18] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
outputs[19] = "id4_R_t2: 2;id5_R_t2: 1;id6_R_t2: 2";
outputs[20] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[22] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 1";
outputs[23] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 1";
outputs[24] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[25] = "id4_R_t2: 2;id5_R_t2: 1;id6_R_t2: 1";
outputs[26] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7vyJHC4W4O20KSg8VLR78gKr0WMR4KKj1UE/ifzdpU93GXWiSmXSU9xYmZtqsedjp
//S+J48b58e1/GcTRPe7PJbGmPo6OTedovjm12PNjU4/hlkT49Z398cRoNo4/DeWpn09nSdLOraXXU6UaH
//m055dd2nXB041b63arJuLw/z17xunc5unQL1XqBPP1AvPvczGl2fRVc3/+/OVvWf++l5q31v1e1A3g7k
//7UDlDuvVnZyOV8u7tWabb5xdeZRfvbV030u0OTXwX1f0Hxf/PW93f2N/z3W/22neb328WtvHxWs6HI8u
//b887B7EPjwEe4GkRD5V9MNJxV1IcjrvrGMABnH3uOiS165A8HnfXscADPIpGNucU08BWVLnHNcABHD3j
//2i5sqgxrDdGERjWgARpNo1qT3Yak4bi7jQEcwFE0phH7mEYyYxrgAI6eMY2YxzSSGdOABmg0jWnEPqYx
//wsmPE6YoWvqR+fnUxPv4JoEeSWM40ndW5aGv8ng3XLHSt0i8n5c0g+M5mTCF0dv1pFocfTe5D/mx8AM/
//Lfqx4WmNQY/1TmxSdgzswE6LdkjUDrVqx5ZSAtiBnT3tO79O8ew6blXGjYEbuNmfG5JxQyJuDNzAjY5Z
//rbEbatFNKF+zcAM3qvK1Jm8QhH7l7PAOQY1sDXZgR1O2toucaslaMzcGbuDmD+Rq9V/1lN9vLNzAjcpM
//rf5u40/U+MwYmIEZlXlafTMkYMbADMyoz9LqT2cSZkI5moEZmFGVo5FAjkYiORrswI6mHI3YczQSydHg
//Bm405WjEnqORSI4GN3CjJ0cj5hyNRHI0mIEZPTkaMedoJJKjwQzM6MnRiDlH29XMFw4idKg=
