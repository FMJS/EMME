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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2s1qg0AUBeB9n2KWLQQmznW0tHTRUEI3bSFdZCkFsxCapguzKnn3ajRi9NoaZ0wUzk7u3PFnDB/m
//MFJutvH3NpZSRKEXLIJY3YnpfRT6h2Mp15tw9Zk0PM/Eg/i5jkIVLIPYmSQzaH90MxFHVZet6lKV2F5i
//e122mt1rWs3uNKs6Scf6I/pK66rUXa5TQ91tqOuGutdw3fx+duLx9Um8vGHN2q9Z5ek9tlruJbaX2F6X
//7XXZXs326mpv9o4Xs/n+JR+t8OHpkpnTdHbToJMP+tyg+muQDpef5z8x9vz87Gzm+zKdubuSHAIKCAAB
//IGALAaeGQLHM0/4JYK7aGQbfuwUNoAE09Pd9UCync04ayJwGH38dQANoMKOh9mFwLhgU+8LNWQAKQAEo
//DCBPoNpgseDKIE2o1PNzImMADIBhDBmDDRZaJwydsUDuAC7AxQByB7tcUF9cIIsAF+Di0llENyw6JRGd
//qQAUgAJQDHK/Q7GwZC+f0MgnAANgGPMeiNNZ6JpPaOQT4AJcjHtfhAkX1BcXyCfABbgY3l6JNljYyCc0
//8glAASgGn0+U8kqb6YTLYoFsAigAhaFnE1ZJ+C+ZMIUCuQSoABWXyiV6ooL6oQKZBKgAFRfJJAyhOCWR
//aM/EL+MIXwQ=
