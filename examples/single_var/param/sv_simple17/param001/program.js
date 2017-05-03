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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28tKw0AUgOG9T5GlQmGazNiC4sIixY0KddFlEOIiYK2LdCW+u0mTtmk7SRtzH/9dOTNzcpn048Bw
//hFiugq9VIITleyN35gbyxhre+t5481uIxdJ7/wgnPE6sO+v70vccd+4G9iBcIde/rgbWXlSlolIbja8U
//RePrxFE7nLF48z+juJOanY7LjLjKiF9Hcec4Psq4bnI/P9b984P19PJ/nvjgidJZdtGRdm46g9RmkNoM
//UptBaTMobQalzRCvO5y7i+7t8WwyXW/y3h5t3k+4chitzhq08wadvEGZDI7zVo71K5MbnyYfpza/fnW8
//8nWerCzyh7gQUAEVUJFDRXkNdoPbLR7WD4XmqoX5gAmYgInyFUVBJrZbaTfJhIQJmICJepkoWzC0jYSj
///QihAzqgo0cVhmoFDwUTMAETfakwVIcqDOiADujo7KnIsSvbB3KaxCP9GmECJmCi6RORQhVGO0joKwzo
//gA7oaLPCOOMgpG06JHRAB3S0QUe5w5Fu1hxwAidw0odKRHUNFAUd0AEdna9EVD8qETiBEzj5N70ox4Mp
//jP7eiXIQT3Ke7k+BCZiAia71oVSBxNldKKfpAAmQAImudaFUi4QECZAACbN6UOqrI4ADOIDD4A6UaulQ
//IAESIGFW/0kT1QVwAAdwGNd9Ui0dJw5LQQIkQKJvvSdNVBfAARzAYVjnSX3nIsABHMBhaN9J02clYAIm
//YGJs10l95yfAARzAYWjPSdNnKlVi8gv0C5q8
