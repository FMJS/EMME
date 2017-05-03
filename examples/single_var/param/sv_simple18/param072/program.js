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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 3;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[7] = "id6_R_t2: 1;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwis66jpBz00lNBLW0gPOUrAHoSm6cGcSv57NX5gkrHVdVdTeG9hdjaaNTwM
//L0q52SZf20RKEUdBuAgT91Y4d3E0LT9Lud5E7x9pw9NM3Ivvyzhyw2WYqEm6g/afribioOqxVb9WJbaX
//2F6Preb3mlXzO82rKu1Yr+LPrO7Wuut1aqh7DXW/oR40XLe4n514eHkUz684s/ZndvTrA7Za7yW2l9he
//j+312F6f7fWPe/NnvJjN9w/54ITLX5fudLLdTYuqWJxyi+5vi1Refl78xdjv53fnO9+W2c7dheQQUEAA
//CAABUwioEwSqY3bsE8BcVRsGTAeAATBYnA6q41RDwkC9YcDEABgAQz8YToaCoVhw2QdORqcFBRSAAlAY
//J0ugk8XqwN0eScJRvfjOjtMCYAAMgGGUfMEEC63TBW0sMEUAC2AxeuZgFguyhAUmC2ABLEbOIfSo0Eoh
//jEwV0+AaVIAKUHEubzpUB0vm0glfa4YADaABNJzN+w/dYdDNJ3xMEuACXPzvtyL6cEGWuMB0AS7AxRm+
//K9EGCxMZhe5kcQMqQAWoGDCjqKWWJhMKj+VCd4IAC2ABLAyXTxhF4a90oi8VmCBABagYK5uwRAVZoQJT
//BagAFePkEj2h6JJKtGfiB6B9Xyg=
