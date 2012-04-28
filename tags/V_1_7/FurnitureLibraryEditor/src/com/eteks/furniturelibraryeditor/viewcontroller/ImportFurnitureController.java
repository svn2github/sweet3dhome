/*
 * ImportFurnitureController.java 13 janv. 2010
 *
 * Furniture Library Editor, Copyright (c) 2010 Emmanuel PUYBARET / eTeks <info@eteks.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */
package com.eteks.furniturelibraryeditor.viewcontroller;

import java.util.concurrent.Callable;

import com.eteks.furniturelibraryeditor.model.FurnitureLibrary;
import com.eteks.furniturelibraryeditor.model.FurnitureLibraryUserPreferences;
import com.eteks.sweethome3d.model.BackgroundImage;
import com.eteks.sweethome3d.model.CatalogPieceOfFurniture;
import com.eteks.sweethome3d.model.CatalogTexture;
import com.eteks.sweethome3d.model.FurnitureCatalog;
import com.eteks.sweethome3d.model.Home;
import com.eteks.sweethome3d.model.RecorderException;
import com.eteks.sweethome3d.model.UserPreferences;
import com.eteks.sweethome3d.viewcontroller.BackgroundImageWizardController;
import com.eteks.sweethome3d.viewcontroller.CompassController;
import com.eteks.sweethome3d.viewcontroller.ContentManager;
import com.eteks.sweethome3d.viewcontroller.Controller;
import com.eteks.sweethome3d.viewcontroller.DialogView;
import com.eteks.sweethome3d.viewcontroller.FurnitureCatalogController;
import com.eteks.sweethome3d.viewcontroller.FurnitureController;
import com.eteks.sweethome3d.viewcontroller.HelpController;
import com.eteks.sweethome3d.viewcontroller.HelpView;
import com.eteks.sweethome3d.viewcontroller.Home3DAttributesController;
import com.eteks.sweethome3d.viewcontroller.HomeController;
import com.eteks.sweethome3d.viewcontroller.HomeController3D;
import com.eteks.sweethome3d.viewcontroller.HomeFurnitureController;
import com.eteks.sweethome3d.viewcontroller.HomeView;
import com.eteks.sweethome3d.viewcontroller.ImportedFurnitureWizardController;
import com.eteks.sweethome3d.viewcontroller.ImportedFurnitureWizardStepsView;
import com.eteks.sweethome3d.viewcontroller.ImportedTextureWizardController;
import com.eteks.sweethome3d.viewcontroller.LabelController;
import com.eteks.sweethome3d.viewcontroller.LevelController;
import com.eteks.sweethome3d.viewcontroller.ObserverCameraController;
import com.eteks.sweethome3d.viewcontroller.PageSetupController;
import com.eteks.sweethome3d.viewcontroller.PhotoController;
import com.eteks.sweethome3d.viewcontroller.PlanController;
import com.eteks.sweethome3d.viewcontroller.PlanView;
import com.eteks.sweethome3d.viewcontroller.PrintPreviewController;
import com.eteks.sweethome3d.viewcontroller.RoomController;
import com.eteks.sweethome3d.viewcontroller.TextureChoiceController;
import com.eteks.sweethome3d.viewcontroller.TextureChoiceView;
import com.eteks.sweethome3d.viewcontroller.ThreadedTaskController;
import com.eteks.sweethome3d.viewcontroller.ThreadedTaskView;
import com.eteks.sweethome3d.viewcontroller.UserPreferencesController;
import com.eteks.sweethome3d.viewcontroller.VideoController;
import com.eteks.sweethome3d.viewcontroller.View;
import com.eteks.sweethome3d.viewcontroller.ViewFactory;
import com.eteks.sweethome3d.viewcontroller.WallController;
import com.eteks.sweethome3d.viewcontroller.WizardController;

/**
 * Controller used to import furniture.
 * @author Emmanuel Puybaret
 */
public class ImportFurnitureController implements Controller {
  private ThreadedTaskController threadedTaskController;
  
  public ImportFurnitureController(final FurnitureLibrary furnitureLibrary,
                                   final String [] furnitureNames, 
                                   final Runnable postImportTask,
                                   final FurnitureLibraryUserPreferences preferences, 
                                   final EditorViewFactory editorViewFactory,
                                   final ContentManager contentManager) {
    Callable<Void> importFurnitureTask = new Callable<Void>() {
        public Void call() throws InterruptedException {
          ImportFurnitureTaskView importFurnitureView = (ImportFurnitureTaskView)threadedTaskController.getView();
          for (int i = 0; i < furnitureNames.length; i++) {
            String furnitureName = furnitureNames [i];
            try {
              importFurnitureView.setProgress(i, 0, furnitureNames.length);
              final CatalogPieceOfFurniture piece = importFurnitureView.readPieceOfFurniture(
                  contentManager.getContent(furnitureName));
              if (piece != null) {
                importFurnitureView.invokeLater(new Runnable() {
                  public void run() {
                    furnitureLibrary.addPieceOfFurniture(piece);
                  }
                });
              }
            } catch (RecorderException ex) {
            }            
          }
          
          importFurnitureView.invokeLater(postImportTask);
          return null;
        }
      };

    ThreadedTaskController.ExceptionHandler exceptionHandler = 
      new ThreadedTaskController.ExceptionHandler() {
        public void handleException(Exception ex) {
          if (!(ex instanceof InterruptedException)) {
            ex.printStackTrace();
          }
        }
      };
   
    ViewFactory threadedTaskViewFactory = new ViewFactory() {
        public ThreadedTaskView createThreadedTaskView(String taskMessage, UserPreferences preferences,
                                                       ThreadedTaskController controller) {
          return editorViewFactory.createImportFurnitureView(taskMessage, (FurnitureLibraryUserPreferences)preferences, controller);
        }

        public View createBackgroundImageWizardStepsView(BackgroundImage backgroundImage,
                                                         UserPreferences preferences,
                                                         BackgroundImageWizardController backgroundImageWizardController) {
          throw new UnsupportedOperationException();
        }

        public View createFurnitureCatalogView(FurnitureCatalog catalog,
                                               UserPreferences preferences,
                                               FurnitureCatalogController furnitureCatalogController) {
          throw new UnsupportedOperationException();
        }

        public View createFurnitureView(Home home,
                                        UserPreferences preferences,
                                        FurnitureController furnitureController) {
          throw new UnsupportedOperationException();
        }

        public HelpView createHelpView(UserPreferences preferences,
                                       HelpController helpController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createHome3DAttributesView(UserPreferences preferences,
                                                     Home3DAttributesController home3dAttributesController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createLevelView(UserPreferences preferences,
                                          LevelController levelController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createHomeFurnitureView(UserPreferences preferences,
                                                  HomeFurnitureController homeFurnitureController) {
          throw new UnsupportedOperationException();
        }

        public HomeView createHomeView(Home home,
                                       UserPreferences preferences,
                                       HomeController homeController) {
          throw new UnsupportedOperationException();
        }

        public ImportedFurnitureWizardStepsView createImportedFurnitureWizardStepsView(CatalogPieceOfFurniture piece,
                                                                                       String modelName,
                                                                                       boolean importHomePiece,
                                                                                       UserPreferences preferences,
                                                                                       ImportedFurnitureWizardController importedFurnitureWizardController) {
          throw new UnsupportedOperationException();
        }

        public View createImportedTextureWizardStepsView(CatalogTexture texture,
                                                         String textureName,
                                                         UserPreferences preferences,
                                                         ImportedTextureWizardController importedTextureWizardController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createLabelView(boolean modification,
                                          UserPreferences preferences,
                                          LabelController labelController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createPageSetupView(UserPreferences preferences,
                                              PageSetupController pageSetupController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createPhotoView(Home home,
                                          UserPreferences preferences,
                                          PhotoController photoController) {
          throw new UnsupportedOperationException();
        }

        public PlanView createPlanView(Home home,
                                       UserPreferences preferences,
                                       PlanController planController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createPrintPreviewView(Home home,
                                                 UserPreferences preferences,
                                                 HomeController homeController,
                                                 PrintPreviewController printPreviewController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createRoomView(UserPreferences preferences,
                                         RoomController roomController) {
          throw new UnsupportedOperationException();
        }

        public TextureChoiceView createTextureChoiceView(UserPreferences preferences,
                                                         TextureChoiceController textureChoiceController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createUserPreferencesView(UserPreferences preferences,
                                                    UserPreferencesController userPreferencesController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createVideoView(Home home,
                                          UserPreferences preferences,
                                          VideoController videoController) {
          throw new UnsupportedOperationException();
        }

        public View createView3D(Home home,
                                 UserPreferences preferences,
                                 HomeController3D homeController3D) {
          throw new UnsupportedOperationException();
        }

        public DialogView createWallView(UserPreferences preferences,
                                         WallController wallController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createWizardView(UserPreferences preferences,
                                           WizardController wizardController) {
          throw new UnsupportedOperationException();
        }
        
        public DialogView createCompassView(UserPreferences preferences,
                                            CompassController compassController) {
          throw new UnsupportedOperationException();
        }

        public DialogView createObserverCameraView(UserPreferences preferences,
                                                   ObserverCameraController home3dAttributesController) {
          throw new UnsupportedOperationException();
        }
      };

   String importFurnitureMessage = preferences.getLocalizedString(ImportFurnitureController.class, "importFurnitureMessage");
   this.threadedTaskController = new ThreadedTaskController(importFurnitureTask, importFurnitureMessage, exceptionHandler, 
       preferences, threadedTaskViewFactory);
  }
  
  /**
   * Executes the import task.
   */
  public void executeTask(View view) {
    this.threadedTaskController.executeTask(view);
  }

  /**
   * Returns the view associated to this controller.
   */
  public View getView() {
    return this.threadedTaskController.getView();
  }
}
