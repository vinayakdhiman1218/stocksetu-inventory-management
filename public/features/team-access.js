/* Team & access frontend preview. Invitations and role assignments remain browser-local until backend support is added. */
const TEAM_ACCESS_ROLES = {
  secondary_admin: {
    label: 'Secondary Admin',
    summary: 'A trusted operator who can manage the workspace and its people.',
    allowed: ['Manage products, sales, purchases, customers and suppliers', 'View reports and financial performance', 'Change business settings and invite or manage teammates'],
    restricted: ['No access to the primary owner’s sign-in credentials'],
    access: { overview: 'Full', inventory: 'Edit', sales: 'Full', reports: 'Full', settings: 'Full', team: 'Full' },
  },
  biller: {
    label: 'Biller / Salesman',
    summary: 'Creates bills and records daily sales without access to company-wide profit or setup.',
    allowed: ['Create sales bills and invoices', 'Look up customers and record daily transactions', 'View the sales information needed to serve customers'],
    restricted: ['Company profit and financial reports', 'Business settings, team access and purchase costs'],
    access: { overview: 'Sales only', inventory: 'Look up', sales: 'Edit', reports: 'No access', settings: 'No access', team: 'No access' },
  },
  accountant: {
    label: 'Accountant',
    summary: 'Reviews financial performance, expenses, tax settings and business reports.',
    allowed: ['View financial charts and business reports', 'Record and review expenses', 'Manage tax filing parameters'],
    restricted: ['Team invitations and access administration', 'Changing core business identity or stock counts'],
    access: { overview: 'Financial', inventory: 'View', sales: 'Financial', reports: 'Full', settings: 'Tax only', team: 'No access' },
  },
  stock_keeper: {
    label: 'Stock Keeper',
    summary: 'Maintains accurate quantities, movements and warehouse adjustments.',
    allowed: ['Manage live stock levels, products and stock movements', 'Receive purchases and make warehouse adjustments', 'View reorder alerts and supplier details'],
    restricted: ['Sensitive billing, sales totals, margins and profit reports', 'Business settings and team access'],
    access: { overview: 'Stock only', inventory: 'Full', sales: 'No access', reports: 'Stock only', settings: 'No access', team: 'No access' },
  },
  viewer: {
    label: 'Viewer',
    summary: 'Can track selected dashboard information without changing records.',
    allowed: ['Read-only access to the overview and approved dashboards', 'View selected stock or business metrics'],
    restricted: ['All changes, transactions, settings and team management'],
    access: { overview: 'View', inventory: 'View', sales: 'View', reports: 'Selected', settings: 'No access', team: 'No access' },
  },
};
const TEAM_ACCESS_ORDER = Object.keys(TEAM_ACCESS_ROLES);
function readTeamAccess() {
  const fallback = { members: [], invitations: [] };
  try {
    const value = JSON.parse(localStorage.getItem(`stocksetu-account:${accountId()}:team-access`) || '{}');
    return {
      members: Array.isArray(value.members) ? value.members : [],
      invitations: Array.isArray(value.invitations) ? value.invitations : [],
    };
  } catch { return fallback; }
}
function writeTeamAccess(value) {
  localStorage.setItem(`stocksetu-account:${accountId()}:team-access`, JSON.stringify(value));
}
function teamInitials(value) {
  return String(value || '?').split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}
function teamAccessPage() {
  const data = readTeamAccess();
  const ownerName = getUser();
  const ownerEmail = (localStorage.getItem('stocksetu-user') || '').includes('@') ? localStorage.getItem('stocksetu-user') : '';
  const memberRows = [
    `<tr><td><div class="team-person"><i class="team-avatar">${escapeHTML(teamInitials(ownerName))}</i><span><b>${escapeHTML(ownerName)}</b><small>${escapeHTML(ownerEmail || 'Current workspace account')}</small></span></div></td><td><span class="team-role owner-role">Owner</span></td><td><span class="team-status active-status"><i></i> Active</span></td><td><span class="team-owner-label">Primary owner</span></td></tr>`,
    ...data.members.map(member => `<tr><td><div class="team-person"><i class="team-avatar">${escapeHTML(teamInitials(member.email))}</i><span><b>${escapeHTML(member.email)}</b><small>Added ${escapeHTML(member.addedAt || 'just now')}</small></span></div></td><td><label class="sr-only" for="team-role-${escapeHTML(member.id)}">Role for ${escapeHTML(member.email)}</label><select class="team-role-select" id="team-role-${escapeHTML(member.id)}" data-team-role="${escapeHTML(member.id)}">${TEAM_ACCESS_ORDER.map(role => `<option value="${role}" ${member.role === role ? 'selected' : ''}>${escapeHTML(TEAM_ACCESS_ROLES[role].label)}</option>`).join('')}</select></td><td><span class="team-status active-status"><i></i> Preview access</span></td><td><button class="text-btn danger-link" type="button" data-action="team-remove-member" data-id="${escapeHTML(member.id)}">Remove</button></td></tr>`),
    ...data.invitations.map(invite => `<tr><td><div class="team-person"><i class="team-avatar pending-avatar">${escapeHTML(teamInitials(invite.email))}</i><span><b>${escapeHTML(invite.email)}</b><small>Added ${escapeHTML(invite.addedAt || 'just now')}</small></span></div></td><td><span class="team-role">${escapeHTML(TEAM_ACCESS_ROLES[invite.role]?.label || 'Viewer')}</span></td><td><span class="team-status pending-status"><i></i> Invite preview</span></td><td><div class="team-invite-actions"><button class="text-btn" type="button" data-action="team-activate-invite" data-id="${escapeHTML(invite.id)}">Simulate join</button><button class="text-btn danger-link" type="button" data-action="team-cancel-invite" data-id="${escapeHTML(invite.id)}">Cancel</button></div></td></tr>`),
  ].join('');
  const previewNotice = `<div class="team-preview-note" role="note"><i>${icon('spark')}</i><span><b>Frontend preview</b><small>Invites and role changes are saved in this browser for review. No email is sent and these roles do not enforce backend permissions yet.</small></span></div>`;
  const roleCards = TEAM_ACCESS_ORDER.map(role => {
    const item = TEAM_ACCESS_ROLES[role];
    return `<article class="team-role-card"><div class="team-role-card-head"><i>${icon(role === 'stock_keeper' ? 'box' : role === 'accountant' ? 'chart' : role === 'viewer' ? 'eye' : role === 'biller' ? 'receipt' : 'shield')}</i><h3>${escapeHTML(item.label)}</h3></div><p>${escapeHTML(item.summary)}</p><ul>${item.allowed.slice(0, 2).map(text => `<li class="permission-allowed">${icon('check')}<span>${escapeHTML(text)}</span></li>`).join('')}${item.restricted.slice(0, 1).map(text => `<li class="permission-restricted">${icon('close')}<span>${escapeHTML(text)}</span></li>`).join('')}</ul><button type="button" class="text-btn" data-action="team-view-role" data-id="${role}">View access details ${icon('arrow')}</button></article>`;
  }).join('');
  return `<div class="panel-header"><div><h2>Team & access</h2><p>Invite teammates and choose access that fits their role.</p></div><i class="settings-emblem">${icon('users')}</i></div><div class="team-access-content">${previewNotice}<div class="team-summary-grid"><article><span>Workspace owner</span><b>${escapeHTML(ownerName)}</b><small>Full control</small></article><article><span>Active teammates</span><b>${data.members.length}</b><small>Preview members</small></article><article><span>Pending invites</span><b>${data.invitations.length}</b><small>Not sent by email</small></article></div><section class="team-section"><div class="team-section-heading"><div><h3>People in this workspace</h3><p>Review members, their role and invitation status.</p></div><button class="btn btn-sm" type="button" data-action="team-invite">${icon('plus')} Add team member</button></div><div class="team-table-wrap"><table class="team-table"><thead><tr><th>MEMBER</th><th>ROLE</th><th>STATUS</th><th>ACCESS</th></tr></thead><tbody>${memberRows}</tbody></table></div></section><section class="team-section team-roles-section"><div class="team-section-heading"><div><h3>Role guide</h3><p>Each role is designed around common day-to-day responsibilities.</p></div></div><div class="team-role-grid">${roleCards}</div></section></div>`;
}
function openTeamInviteModal() {
  const choices = TEAM_ACCESS_ORDER.map(role => `<option value="${role}">${escapeHTML(TEAM_ACCESS_ROLES[role].label)}</option>`).join('');
  showModal('Add a team member', 'Choose a role and preview their workspace access.', `<form data-form="team-invite" class="team-invite-form"><div class="field"><label for="team-invite-email">Team member email</label><input id="team-invite-email" name="email" type="email" maxlength="254" placeholder="name@business.com" autocomplete="off" required></div><div class="field"><label for="team-invite-role">Workspace role</label><select id="team-invite-role" name="role">${choices}</select></div><div class="role-preview" id="team-role-preview">${teamRolePreview('secondary_admin')}</div><p class="team-form-note">This adds a local preview entry only. It will not email the person or grant backend access.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Add preview member ${icon('arrow')}</button></div></form>`);
  const select = document.querySelector('#team-invite-role');
  select?.addEventListener('change', () => {
    const preview = document.querySelector('#team-role-preview');
    if (preview) preview.innerHTML = teamRolePreview(select.value);
  });
}
function teamRolePreview(role) {
  const item = TEAM_ACCESS_ROLES[role] || TEAM_ACCESS_ROLES.viewer;
  return `<div class="role-preview-heading"><b>${escapeHTML(item.label)} access</b><span>Role preview</span></div><p>${escapeHTML(item.summary)}</p><div class="role-preview-lists"><div><b>Can do</b><ul>${item.allowed.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ul></div><div><b>Restricted</b><ul>${item.restricted.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ul></div></div>`;
}
function saveTeamInvite(form) {
  const values = Object.fromEntries(new FormData(form));
  const email = String(values.email || '').trim().toLowerCase();
  const role = TEAM_ACCESS_ROLES[values.role] ? values.role : 'viewer';
  if (!email) return;
  const data = readTeamAccess();
  const ownerEmail = String(localStorage.getItem('stocksetu-user') || '').trim().toLowerCase();
  if (email === ownerEmail || data.members.some(member => member.email === email) || data.invitations.some(invite => invite.email === email)) {
    toast('This email is already part of this workspace.');
    return;
  }
  const id = `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  data.invitations.push({ id, email, role, addedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) });
  writeTeamAccess(data);
  closeModal();
  renderDashboard();
  toast('Preview invite added. No email was sent.');
}
function handleTeamAccessAction(action, id) {
  if (action === 'team-invite') { openTeamInviteModal(); return true; }
  if (action === 'team-view-role') { const role = TEAM_ACCESS_ROLES[id]; if (role) showModal(role.label, role.summary, teamRolePreview(id) + `<div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Close</button></div>`); return true; }
  if (action === 'team-activate-invite') {
    const data = readTeamAccess();
    const invite = data.invitations.find(item => item.id === id);
    if (invite) {
      data.invitations = data.invitations.filter(item => item.id !== id);
      data.members.push({ ...invite, joinedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) });
      writeTeamAccess(data); renderDashboard(); toast('Preview member marked as joined. No account was created.');
    }
    return true;
  }
  if (action === 'team-cancel-invite') {
    const data = readTeamAccess(); data.invitations = data.invitations.filter(invite => invite.id !== id); writeTeamAccess(data); renderDashboard(); toast('Preview invite removed.'); return true;
  }
  if (action === 'team-remove-member') {
    const data = readTeamAccess(); const member = data.members.find(item => item.id === id);
    if (member && confirm(`Remove ${member.email} from this local workspace preview?`)) { data.members = data.members.filter(item => item.id !== id); writeTeamAccess(data); renderDashboard(); toast('Preview member removed.'); }
    return true;
  }
  return false;
}
function handleTeamRoleChange(select) {
  const data = readTeamAccess(); const member = data.members.find(item => item.id === select.dataset.teamRole);
  if (!member || !TEAM_ACCESS_ROLES[select.value]) return;
  member.role = select.value; writeTeamAccess(data); renderDashboard(); toast(`Preview role updated to ${TEAM_ACCESS_ROLES[select.value].label}.`);
}
function handleTeamAccessForm(form) {
  if (form.dataset.form !== 'team-invite') return false;
  saveTeamInvite(form); return true;
}
