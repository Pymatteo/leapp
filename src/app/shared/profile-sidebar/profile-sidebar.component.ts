import {Component, OnInit} from '@angular/core';
import {AppService} from '../../services-system/app.service';
import {ConfigurationService} from '../../services-system/configuration.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {AntiMemLeak} from '../../core/anti-mem-leak';
import {HttpClient} from '@angular/common/http';
import {ExecuteServiceService} from '../../services-system/execute-service.service';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent extends AntiMemLeak implements OnInit {

  profileOpen = false;
  test: any;

  /* Profile Sidebar with links */
  constructor(
    private appService: AppService,
    private configurationService: ConfigurationService,
    private router: Router,
    private httpClient: HttpClient,
    private executeService: ExecuteServiceService
  ) { super(); }

  /**
   * Init the profile sidebar using the event emitter status listener
   */
  ngOnInit() {
    const sub = this.appService.profileOpen.subscribe(res => {
      this.profileOpen = res;
    });
    this.subs.add(sub);
  }

  /**
   * logout from Leapp
   */
  logout() {
    // Google clean
    this.httpClient.get('https://mail.google.com/mail/u/0/?logout&hl=en').subscribe(res => {}, err => {
      this.configurationService.newConfigurationFileSync();
    });
    // Azure Clean
    const workspace = this.configurationService.getDefaultWorkspaceSync();
    workspace.azureProfile = null;
    workspace.azureConfig = null;
    this.configurationService.updateWorkspaceSync(workspace);
    this.executeService.execute('az account clear 2>&1').subscribe(res => {}, err => {});
  }

  /**
   * Go to Account Management
   */
  gotToAccountManagement() {
    this.closeProfile();
    this.router.navigate(['/sessions', 'list-accounts']);
  }

  closeProfile() {
    this.profileOpen = false;
    this.appService.profileOpen.emit(false);
  }

  goToProfile() {
    this.closeProfile();
    this.router.navigate(['/profile']);
  }
}
