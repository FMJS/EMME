sig mem_events {T: tear_type, R: order_type, O: operation_type, B : blocks, M: set bytes, A: active_type}

abstract sig tear_type {}
one sig WT extends tear_type{}
one sig NT extends tear_type{}

abstract sig active_type {}
one sig ENABLED extends active_type{}
one sig DISABLED extends active_type{}

abstract sig order_type {}
one sig I extends order_type{}
one sig U extends order_type{}
one sig SC extends order_type{}

abstract sig operation_type {}
one sig R extends operation_type{}
one sig W extends operation_type{}
one sig M extends operation_type{}

sig blocks {}
sig bytes {}

sig threads {E: set mem_events, PO: mem_events -> mem_events}

// fact ev_threads {all ev: mem_events | some t: threads | ev in t.E}
// fact single_ev_thread {all e1,e2: mem_events | all t1,t2: threads | (e1 in t1.E) and (e2 in t2.E) and (t1 != t2) => (e1 != e2)}
// fact thread_order {all t: threads | all e1, e2: mem_events | (e1 in t.E) and (e2 in t.E) <=> (((e1 -> e2) in t.PO) or ((e2 -> e1) in t.PO))}
// fact thread_closure {all t: threads | all e1, e2, e3: mem_events | (e1 in t.E) and (e2 in t.E) and (e3 in t.E) and ((e1 -> e2) in t.PO) and ((e2 -> e3) in t.PO) => ((e1 -> e3) in t.PO)}
// fact not_empty_threads {all t: threads | t.E != none}

// For each element in the sets tear_type, order_type, operation_type, blocks, and bytes there should be at least one event in the mem_events matching it
// fact tear_match {all te: tear_type | some ev:mem_events | ev.tear = te}
// fact order_match {all ord: order_type | some ev:mem_events | ev.R = ord}
// fact operation_match {all op: operation_type | some ev:mem_events | ev.O = op}
// fact block_match {all bl: blocks | some ev:mem_events | ev.B = bl}
// fact addresses_match {all add: bytes | some ev:mem_events | add in ev.M}

// The events should have all fields assigned
// fact nempty_tear {all ev: mem_events | ev.T != none}
// fact nempty_order {all ev: mem_events | ev.R != none}
// fact nempty_operation {all ev: mem_events | ev.O != none}
// fact nempty_block {all ev: mem_events | ev.B != none}
// fact nempty_address {all ev: mem_events | ev.M != none}

pred Read(e: mem_events) { e.O in R }
pred Write(e: mem_events) { e.O in W }
pred Modify(e: mem_events) { e.O in M }
pred RoM(e: mem_events) { Read [e] or Modify [e] }
pred WoM(e: mem_events) { Write [e] or Modify [e]}

pred SeqCst(e: mem_events) {e.R in SC}
pred Init(e: mem_events) {e.R in I}
pred Unord(e: mem_events) {e.R in U}

pred BlockEQ(e1:mem_events, e2:mem_events) {e1.B= e2.B}
pred AddrIN(e1:mem_events, e2:mem_events) {(e1.M & e2.M) != none}
pred AddrEQ(e1:mem_events, e2:mem_events) {e1.M = e2.M}
pred RangeIN(e1:mem_events, e2:mem_events) {BlockEQ [e1,e2] and AddrIN [e1,e2]}
pred RangeEQ(e1:mem_events, e2:mem_events) {BlockEQ [e1,e2] and AddrEQ [e1,e2]}
pred NoTear(e: mem_events) { e.T in NT }
pred Block(e:mem_events, b:blocks) {e.B = b}

pred Active(e:mem_events) {e.A = ENABLED}
pred Active2(e1, e2 :mem_events) {(e1.A = ENABLED) and (e2.A = ENABLED)}
pred Active3(e1, e2, e3 :mem_events) {(e1.A = ENABLED) and (e2.A = ENABLED) and (e3.A = ENABLED)}

-- Preconditions
//fact init_events {some e: mem_events | all b: blocks | Write [e] and (e.B = b) and (e.M = bytes) and Init [e]}
//fact init_write {all e: mem_events | Init [e] => Write [e]}
//fact init_ao {all e1, e2: mem_events | (e1 != e2) and AO [e1,e2] => (not(Init [e2]))}

-- Agent Order relation
one sig agent_order {rel:  mem_events -> mem_events}
pred AO(e1: mem_events, e2: mem_events) {(e1 -> e2) in agent_order.rel}
//fact ao_def {all t: threads | all e1,e2: mem_events | ((e1 in t.E) and (e2 in t.E) and ((e1 -> e2) in t.PO)) => AO [e1, e2]}

-- Reads From relation
one sig reads_from {rel:  mem_events -> mem_events}
one sig reads_bytes_from {rel:  mem_events -> bytes -> mem_events}

pred RF(e1: mem_events, e2: mem_events) {(e1 -> e2)  in reads_from.rel}
// pred RBF(e1: mem_events, b: bytes, e2: mem_events) {(b in e2.M) and (b in e1.M) and ((e1 -> e2) in reads_from.rel)}
pred RBF(e1: mem_events, b: bytes, e2: mem_events) {(e1 -> b -> e2)  in reads_bytes_from.rel}

fact rbf_def {all er : mem_events | Active [er] => (RoM [er] => (all b : bytes | (b in er.M) => (one ew : mem_events | Active [ew] and (b in ew.M) and BlockEQ [er,ew] and WoM [ew] and RBF [er,b,ew]))) }
fact rbf_def_2 {all er,ew : mem_events | Active2 [er,ew] => (all b : bytes | RBF [er,b,ew] => (RoM [er] and WoM [ew]))}
fact rbf_rf_def {all e1,e2 : mem_events | Active2 [e1,e2] => (RF [e1,e2] <=> (some b:bytes | RBF [e1,b,e2]))}
fact rbf_corr {all er,ew: mem_events | Active2 [er,ew] => (all b: bytes | RBF [er,b,ew] => not (some ev: mem_events | Active [ev] and (RBF [er,b,ev] and (ew != ev))))}

-- Synchronizes with relation
one sig synchronizes_with {rel:  mem_events -> mem_events}
pred SW(e1: mem_events, e2: mem_events) {(e1 -> e2)  in synchronizes_with.rel}

pred SW4(er:mem_events, ew:mem_events) {SeqCst [er] and RF[er,ew]}
pred SW4c(er:mem_events, ew:mem_events) {SeqCst [ew] and RangeEQ [er,ew]}
pred SW4di(er:mem_events) {all ev: mem_events | RF [er,ev] => Init [ev]}
pred SW4d(er,ew: mem_events) {Init [ew] and SW4di [er]}

fact sw_def {all er,ew : mem_events | Active2 [ew,er] => (SW [ew,er] <=> ((SW4 [er,ew] and (SW4c [er,ew] or SW4d [er,ew]))))}

-- Happens Before relation
one sig happens_before {rel:  mem_events -> mem_events}
pred HB(e1: mem_events, e2: mem_events) {(e1 -> e2)  in happens_before.rel}

pred HB4a(ee, ed: mem_events) {AO [ee, ed]}
pred HB4b(ee, ed: mem_events) {SW [ee, ed]}
pred HB4c(ee, ed: mem_events) {Init [ee] and RangeIN [ee,ed]}
pred HB4d(ee, ed: mem_events) {some ef : mem_events | HB [ee, ef] and HB [ef, ed]}

fact hb_def {all ee,ed : mem_events | Active2 [ee,ed] => (HB [ee,ed] <=> ((ee != ed) and (HB4a [ee,ed] or HB4b [ee,ed] or HB4c [ee,ed] or HB4d [ee,ed])))}
fact hb_closure {all e1,e2,e3 : mem_events | Active3 [e1,e2,e3] => (HB [e1,e2] and HB [e2,e3] => HB [e1,e3])}

-- Coherent Reads
fact cr_def {all er,ew : mem_events | Active2 [er,ew] => ((RoM [er] and WoM[ew]) => (all b: bytes | (RBF [er,b,ew] => ((not HB [er,ew]) and (not (some ev: mem_events | Active [ev] and (WoM [ev] and (HB [ew,ev] and HB [ev,er] and BlockEQ [ev,ew] and (b in ev.M)))))))))}

-- Tear Free Reads
pred TFR2aiiA1(er,ew: mem_events) {not (some ev: mem_events | RangeEQ [ev,ew] and NoTear [ev] and (not (ev = ew)) and RF [er,ev])}
pred TFR2aiiA(er,ew: mem_events) {RangeEQ [er,ew] => TFR2aiiA1 [er,ew]}
pred TFR2aii(er: mem_events) {all ew : mem_events | (RF [er, ew] and NoTear [ew]) => TFR2aiiA [er,ew]}
pred TFR2a(er: mem_events) {NoTear [er] => TFR2aii [er]}

fact tfr_def {all er: mem_events | RoM [er] => TFR2a [er]}

-- Memory Order
one sig memory_order {rel:  mem_events -> mem_events}
pred MO(e1: mem_events, e2: mem_events) {(e1 -> e2)  in memory_order.rel}

pred MO3bii(ee,ed: mem_events) {not (some ew: mem_events | WoM [ew] and RangeEQ [ew,ed] and MO [ee,ew] and MO [ew,ed])}
pred MO3b(ee,ed: mem_events) {SW [ee,ed] => MO3bii [ee,ed]}
pred MO3a(ee,ed: mem_events) {HB [ee,ed] => MO [ee,ed]}

fact mo_def {all ee,ed: mem_events | Active2 [ee,ed] => (MO3a [ee,ed] and MO3b [ee,ed])}
fact mo_closure {all e1,e2,e3 : mem_events | Active3 [e1,e2,e3] => (MO [e1,e2] and MO [e2,e3] => MO [e1,e3])}
fact mo_tot {all e1,e2 : mem_events | Active2 [e1,e2] => ((e1 != e2) => MO [e1,e2] <=> not (MO [e2,e1]))}


-- RBF(er,x,ew) and RBF(er,y,ev) => (x not in ev) or (y not in ew)

fact rbf_sw {all er,ev,ew: mem_events, x,y: bytes | (RBF [er,x,ew] and RBF [er,y,ev] and (ew != ev) and (x != y)) => (not (x in ev.M) or not(y in ew.M)) }

-- Checks
