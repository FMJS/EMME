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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 513;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131073;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 131328;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 131329;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 131585;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 1;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 256;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 257;id7_R_t3: 2";
outputs[16] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[17] = "id6_R_t3: 513;id7_R_t3: 2";
outputs[18] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[19] = "id6_R_t3: 131073;id7_R_t3: 2";
outputs[20] = "id6_R_t3: 131328;id7_R_t3: 2";
outputs[21] = "id6_R_t3: 131329;id7_R_t3: 2";
outputs[22] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[23] = "id6_R_t3: 131585;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tPwkAUhuG9v6JLTUxKZ5gWNS40xrhRE1ywJCZ1QaLiAlbG/25LKwwwXGp7pkbeXXPaOVwKT74w
//nDAcTycf00kYBqM0HvaHE30edC5GafJzHIZv4/TlNbvg7jq4DD6PR6kaDoaT6DRboWdHJ6dBVu3mxyqv
//mtlRUS165tWiY1GNsivenkfveV1ZPey63lDvWt3tutlQjzc8bvl8voKrh5vg/vE/vrZZffGK7O6LqnFW
//Y2cHu6929tXOvtrZVzv7Lt7r2Fm1rzXOa83qtcU97l/fzm7y0p37edeylZ189aaT0baTattJXZ5Mtq1M
//3CvLJ35bfjid/d2ri5VPg3JllS/EUehCIQIFUDg8FOp/7xcn5ze+I0+C41ErQ7EdBGViSIAEckIdEuY3
//OPJJghYjIYEESDg8EuoGgbZBsD9s8kyYSMEETJAc6hgyf0u8QmHfiGZJ0JAACSSH3yeHdkBwJwcpJiId
//dRLCA1IQHir8TLnOyPzFK59WGEkVyA+owP5EjfzQjgnu/CAohVY9pEAK8kPVnYm2pdD+pThDCqQ4PCnq
//bVj8zUThXQ/T66IHepAzqu5jtO1H1/nRFJXCIAVSkDOqbW/8zZzhVw97UkMBB3AQMaQmNdZPWuz8fk5j
//pV723D29sceUBiAAArsgQlMaTXCw94zGbiT2mtEABEAgIQjNaDQLghYDIQEEQOB/ltITGnL5QB6J5fkM
//kAAJUoPQfEazTOz423UNEDQgAAKpQXo6w0dqkEJibTYDJ3CC4CA0m9GsFEbSBLIDJrAnIT6Z4SM7CDqx
//PJeBEzhBdhCZy5DbqPDkxBlO4AT/lpSdyvC9f+HFjuWZDOzADjKGyEyG3LaGJycMTuAEGUN2IsP3bkeT
//dnwDYR4SrA==
