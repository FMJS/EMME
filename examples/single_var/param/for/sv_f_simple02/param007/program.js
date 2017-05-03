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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); Atomics.store(x, i+1, i+2);
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = Atomics.load(x, i); report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 512;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 0;id4_R_t2_1: 3";
outputs[3] = "id4_R_t2_0: 512;id4_R_t2_1: 3";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 1024";
outputs[5] = "id4_R_t2_0: 512;id4_R_t2_1: 1024";
outputs[6] = "id4_R_t2_0: 0;id4_R_t2_1: 1027";
outputs[7] = "id4_R_t2_0: 512;id4_R_t2_1: 1027";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9PgzAYBvC7n6JHl5CUvsyYaDy4mMWLmszDjsRkHkic88BOxu8u8k9KWwKUsgyem+Pd20GLv9An
//cH44xl/HmHMW7ZbhJowp9G+Yf1t+EsknzveH3ftH8qXHFbtj35fRjsJtGAsv6QrSv0J/4THdcWE4Ttnx
//olvt0FTkHs1oxRV4/1eTjyaS7+3fos+/SnYu6nH5SjQVcw+pleJcjBWx+GH3zw/s6QVzOtyc1mZG7lCO
//a+ZF7tBUhDpj2h7z75CxhzT3x2a1Tm+Q2loUV5/0p2OYy0Iui1qZmstBcRrr/DY1/IpphKz7dZt3d/0X
//ueAgCkSBqDMnSmiIKhfEHxkov3479ISrgacrQQAKQAGoc36Gqky8OAVR8sIDKSCFOZ0fUqbHpBGJ0jwr
//jQKUvMkLwBN4Ak9TzaECTbmyOGSZQymVcuw2CRWIAlEgat451OBAtcuh2sHVepMHokAUiJpsEuUGqRYb
//PTAFpsAUsijXSFlkUZZEyVs94dMSRsEoGDWnF6MqSxA4CqRoyEAKSkEpKDWvd6OsjLLLpKjfZg9KQSko
//NbcXpOydstjzQSpIBamQTA3olINkinomU9cwCkbBqEklU1JA7iKZkpd3hGQKSkEpKDWlZMqlUY3JVEe7
//uuz3oBSUglLTSqacO2Xe80EqSIU5RTI1plPdk6muSv0CPryobg==
